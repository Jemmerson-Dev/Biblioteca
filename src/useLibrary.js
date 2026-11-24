// ViewModel: estado + regras de negócio (RN02 a RN06). As telas só exibem e chamam estas funções.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadDb, saveDb } from './storage';
import { seed, gerarLivros } from './data';
import { hoje, somar, norm } from './utils';

const FALHA = 'Não foi possível salvar. Seus dados continuam no formulário, tente novamente.';

export function useLibrary() {
  const [db, setDb] = useState(null);
  const ref = useRef(null);

  useEffect(() => { loadDb(seed).then(d => { ref.current = d; setDb(d); }); }, []);

  // Só troca o estado se a gravação funcionar. Retorna null (ok) ou o texto do erro.
  const commit = useCallback(async next => {
    if (!(await saveDb(next))) return FALHA;
    ref.current = next; setDb(next); return null;
  }, []);

  const books = db?.books ?? [], loans = db?.loans ?? [], readers = db?.readers ?? [];
  // Índices calculados uma vez por mudança de dados, não a cada tecla digitada
  const ativos = useMemo(() => { const m = {}; loans.forEach(l => { if (!l.dev) m[l.bookId] = (m[l.bookId] || 0) + 1; }); return m; }, [loans]);
  const index = useMemo(() => books.map(b => ({ b, k: norm(`${b.titulo} ${b.autor} ${b.categoria}`) })), [books]);
  const livros = useMemo(() => new Map(books.map(b => [b.id, b])), [books]);
  const leitores = useMemo(() => new Map(readers.map(r => [r.id, r])), [readers]);
  const atrasados = useMemo(() => loans.filter(l => !l.dev && l.prazo < hoje()).length, [loans]);

  const salvarLivro = useCallback(async (v, id) => {
    const d = ref.current, n = Number(v.exemplares);
    if (!Number.isInteger(n) || n < 1) return 'Informe pelo menos 1 exemplar.';
    const em = d.loans.filter(l => l.bookId === id && !l.dev).length;
    if (id && n < em) return `Há ${em} exemplar(es) emprestado(s). O total não pode ser menor.`;
    const x = { titulo: v.titulo, autor: v.autor, categoria: v.categoria, exemplares: n };
    return commit(id ? { ...d, books: d.books.map(b => (b.id === id ? { ...b, ...x } : b)) }
                     : { ...d, prox: d.prox + 1, books: [...d.books, { id: d.prox, ...x }] });
  }, [commit]);

  const excluirLivro = useCallback(async id => {
    const d = ref.current;
    if (d.loans.some(l => l.bookId === id && !l.dev)) return 'Não é possível excluir: há exemplares emprestados.';
    return commit({ ...d, books: d.books.filter(b => b.id !== id) });
  }, [commit]);

  const salvarLeitor = useCallback(async (v, id) => {
    const d = ref.current;
    if (!/^\S+@\S+\.\S+$/.test(v.email)) return 'Informe um e-mail válido.';
    if (d.readers.some(r => r.matricula === v.matricula && r.id !== id)) return 'Já existe um leitor com essa matrícula.';
    const x = { nome: v.nome, matricula: v.matricula, email: v.email };
    return commit(id ? { ...d, readers: d.readers.map(r => (r.id === id ? { ...r, ...x } : r)) }
                     : { ...d, prox: d.prox + 1, readers: [...d.readers, { id: d.prox, ...x }] });
  }, [commit]);

  const emprestar = useCallback(async v => {
    const d = ref.current;
    const r = d.readers.find(x => x.matricula === v.mat);
    if (!r) return 'Leitor não cadastrado. Cadastre-o na aba Leitores antes de emprestar.';
    const b = d.books.find(x => norm(x.titulo) === norm(v.tit));
    if (!b) return 'Livro não encontrado. Confira o título e pesquise novamente.';
    const em = d.loans.filter(l => l.bookId === b.id && !l.dev).length;
    if (b.exemplares - em < 1) return `Não há exemplar disponível de “${b.titulo}”. O empréstimo não foi registrado.`;
    return commit({ ...d, prox: d.prox + 1, loans: [...d.loans, { id: d.prox, bookId: b.id, readerId: r.id, data: hoje(), prazo: somar(hoje(), d.prazo), dev: null }] });
  }, [commit]);

  const devolver = useCallback(async id => {
    const d = ref.current, l = d.loans.find(x => x.id === id);
    if (!l) return 'Registro de empréstimo não encontrado.';
    if (l.dev) return 'Esse empréstimo já foi devolvido.';
    return commit({ ...d, loans: d.loans.map(x => (x.id === id ? { ...x, dev: hoje() } : x)) });
  }, [commit]);

  const definirPrazo = useCallback(async n => {
    if (!Number.isInteger(n) || n < 1 || n > 365) return 'Informe um prazo entre 1 e 365 dias.';
    return commit({ ...ref.current, prazo: n });
  }, [commit]);

  const gerarTeste = useCallback(() => { const d = ref.current; return commit({ ...d, prox: d.prox + 5000, books: [...d.books, ...gerarLivros(5000, d.prox)] }); }, [commit]);
  const restaurar = useCallback(() => commit(seed()), [commit]);

  return { db, ativos, index, livros, leitores, atrasados, salvarLivro, excluirLivro, salvarLeitor, emprestar, devolver, definirPrazo, gerarTeste, restaurar };
}
