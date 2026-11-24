import { hoje, somar } from './utils';

export function seed() {
  const h = hoje();
  return {
    prox: 100, prazo: 14,
    books: [
      { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', categoria: 'Romance', exemplares: 2 },
      { id: 2, titulo: 'Vidas Secas', autor: 'Graciliano Ramos', categoria: 'Romance', exemplares: 1 },
      { id: 3, titulo: 'Código Limpo', autor: 'Robert C. Martin', categoria: 'Tecnologia', exemplares: 2 },
      { id: 4, titulo: 'Sapiens', autor: 'Yuval Noah Harari', categoria: 'História', exemplares: 1 }
    ],
    readers: [
      { id: 1, nome: 'Ana Souza', matricula: '2024001', email: 'ana@email.com' },
      { id: 2, nome: 'Carlos Lima', matricula: '2024002', email: 'carlos@email.com' }
    ],
    loans: [
      { id: 1, bookId: 2, readerId: 1, data: somar(h, -20), prazo: somar(h, -6), dev: null },
      { id: 2, bookId: 4, readerId: 2, data: somar(h, -3), prazo: somar(h, 11), dev: null }
    ]
  };
}

// Acervo grande para testes de desempenho (Ajustes > Teste de desempenho)
export const gerarLivros = (n, inicio) =>
  Array.from({ length: n }, (_, i) => ({ id: inicio + i, titulo: `Livro de teste ${i + 1}`, autor: `Autor ${i % 50}`, categoria: `Categoria ${i % 10}`, exemplares: 1 + (i % 3) }));
