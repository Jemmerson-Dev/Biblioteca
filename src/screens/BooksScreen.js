import { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { aviso, confirmar } from '../dialog';
import Lista from '../Lista';
import { BookItem } from '../Items';
import FormModal from '../FormModal';
import { useDebounce } from '../useDebounce';
import { norm } from '../utils';
import { C } from '../theme';

const CAMPOS = [{ n: 'titulo', l: 'Título' }, { n: 'autor', l: 'Autor' }, { n: 'categoria', l: 'Categoria' }, { n: 'exemplares', l: 'Exemplares', k: 'number-pad' }];
const NOVO = { exemplares: '1' };

// Catálogo (leitor) e gestão de livros (bibliotecário): RF01, RF03, RF05
export default function BooksScreen({ lib, admin, otimizada }) {
  const [q, setQ] = useState(''); const dq = useDebounce(q, 250);
  const [form, setForm] = useState(null);
  const { index, db, ativos, excluirLivro, salvarLivro } = lib;

  // Busca no índice já normalizado e só depois do debounce
  const data = useMemo(() => { const n = norm(dq.trim()); return n ? index.filter(x => x.k.includes(n)).map(x => x.b) : db.books; }, [dq, index, db.books]);
  const onEdit = useCallback(b => setForm({ id: b.id, initial: b }), []);
  const onDelete = useCallback(b => confirmar('Excluir livro', `Excluir “${b.titulo}”?`, 'Excluir', async () => {
    const e = await excluirLivro(b.id); if (e) aviso('Não foi possível excluir', e);
  }), [excluirLivro]);
  const render = useCallback(({ item }) => <BookItem book={item} livres={item.exemplares - (ativos[item.id] || 0)} admin={admin} onEdit={onEdit} onDelete={onDelete} />, [ativos, admin, onEdit, onDelete]);
  const key = useCallback(b => String(b.id), []);

  return (
    <View style={{ flex: 1 }}>
      <View style={s.topo}>
        <TextInput style={s.busca} value={q} onChangeText={setQ} placeholder="Buscar por título, autor ou categoria" placeholderTextColor={C.mut} accessibilityLabel="Buscar livros" autoCorrect={false} />
        {admin && <Pressable style={s.novo} onPress={() => setForm({ initial: NOVO })} accessibilityRole="button"><Text style={s.novoTxt}>+ Novo livro</Text></Pressable>}
      </View>
      <Lista data={data} renderItem={render} keyExtractor={key} otimizada={otimizada}
        vazio={<Text style={s.vazio}>Nenhum livro encontrado{q ? ` para “${q}”` : ''}. Tente outro título, autor ou categoria.</Text>} />
      <FormModal visible={!!form} title={form?.id ? 'Editar livro' : 'Novo livro'} fields={CAMPOS} initial={form?.initial}
        onSubmit={v => salvarLivro(v, form?.id)} onClose={() => setForm(null)} />
    </View>
  );
}
const s = StyleSheet.create({
  topo: { padding: 14, paddingBottom: 0, gap: 10 },
  busca: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#9DB0B5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  novo: { backgroundColor: C.acc, borderRadius: 8, minHeight: 46, alignItems: 'center', justifyContent: 'center' }, novoTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  vazio: { textAlign: 'center', color: C.mut, padding: 28 }
});
