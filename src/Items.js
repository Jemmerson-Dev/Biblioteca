import { memo } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { C } from './theme';
import { br, dias, hoje } from './utils';

const serif = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const Tag = ({ txt, tipo }) => {
  const [bg, fg] = { ok: [C.okBg, '#1D5A37'], no: [C.badBg, '#8C1D16'], warn: [C.warnBg, C.warn] }[tipo];
  return <View style={[s.tag, { backgroundColor: bg }]}><Text style={[s.tagTxt, { color: fg }]}>{txt}</Text></View>;
};
const Link = ({ txt, onPress, perigo }) => <Pressable onPress={onPress} hitSlop={8} style={s.link} accessibilityRole="button"><Text style={[s.linkTxt, perigo && { color: C.bad }]}>{txt}</Text></Pressable>;

// React.memo: o item só é redesenhado se as próprias props mudarem
export const BookItem = memo(function BookItem({ book, livres, admin, onEdit, onDelete }) {
  return (
    <View style={s.card}>
      <Text style={s.titulo}>{book.titulo}</Text>
      <Text style={s.meta}>{book.autor} · {book.categoria}</Text>
      <View style={s.linha}>
        <Tag tipo={livres > 0 ? 'ok' : 'no'} txt={livres > 0 ? `Disponível (${livres} de ${book.exemplares})` : 'Emprestado'} />
        {admin && <View style={s.acoes}><Link txt="Editar" onPress={() => onEdit(book)} /><Link txt="Excluir" perigo onPress={() => onDelete(book)} /></View>}
      </View>
    </View>
  );
});

export const ReaderItem = memo(function ReaderItem({ reader, ativos, onEdit }) {
  return (
    <View style={s.card}>
      <Text style={s.titulo}>{reader.nome}</Text>
      <Text style={s.meta}>Matrícula {reader.matricula} · {reader.email}</Text>
      <View style={s.linha}><Text style={s.meta}>Empréstimos ativos: {ativos}</Text><Link txt="Editar" onPress={() => onEdit(reader)} /></View>
    </View>
  );
});

export const LoanItem = memo(function LoanItem({ loan, titulo, leitor, onReturn }) {
  const atras = !loan.dev && loan.prazo < hoje();
  return (
    <View style={s.card}>
      <Text style={s.titulo}>{titulo}</Text>
      <Text style={s.meta}>Nº {loan.id} · {leitor}</Text>
      <Text style={s.meta}>Empréstimo {br(loan.data)} · Devolução prevista {br(loan.prazo)}</Text>
      <View style={s.linha}>
        {loan.dev ? <Tag tipo="ok" txt={`Devolvido em ${br(loan.dev)}`} />
          : atras ? <Tag tipo="no" txt={`Atrasado (${dias(loan.prazo)} dia${dias(loan.prazo) > 1 ? 's' : ''})`} />
          : <Tag tipo="warn" txt="Em andamento" />}
        {!loan.dev && <Link txt="Devolver" onPress={() => onReturn(loan.id)} />}
      </View>
    </View>
  );
});

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: C.line, padding: 14, marginBottom: 10 },
  titulo: { fontSize: 17, fontWeight: '700', color: C.ink, fontFamily: serif }, meta: { fontSize: 14, color: C.mut, marginTop: 2 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }, acoes: { flexDirection: 'row', gap: 6 },
  tag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 }, tagTxt: { fontSize: 13, fontWeight: '700' },
  link: { minHeight: 40, paddingHorizontal: 8, justifyContent: 'center' }, linkTxt: { color: C.acc, fontWeight: '700', fontSize: 15 }
});
