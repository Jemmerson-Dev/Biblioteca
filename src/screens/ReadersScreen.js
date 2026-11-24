import { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import Lista from '../Lista';
import { ReaderItem } from '../Items';
import FormModal from '../FormModal';
import { useDebounce } from '../useDebounce';
import { norm } from '../utils';
import { C } from '../theme';

const CAMPOS = [{ n: 'nome', l: 'Nome' }, { n: 'matricula', l: 'Matrícula' }, { n: 'email', l: 'E-mail', k: 'email-address' }];

// RF02: cadastrar, editar e consultar leitores
export default function ReadersScreen({ lib, otimizada }) {
  const [q, setQ] = useState(''); const dq = useDebounce(q, 250);
  const [form, setForm] = useState(null);
  const { db, ativos, salvarLeitor } = lib;
  const ativosPorLeitor = useMemo(() => { const m = {}; db.loans.forEach(l => { if (!l.dev) m[l.readerId] = (m[l.readerId] || 0) + 1; }); return m; }, [db.loans]);
  const data = useMemo(() => { const n = norm(dq.trim()); return n ? db.readers.filter(r => norm(`${r.nome} ${r.matricula} ${r.email}`).includes(n)) : db.readers; }, [dq, db.readers]);
  const onEdit = useCallback(r => setForm({ id: r.id, initial: r }), []);
  const render = useCallback(({ item }) => <ReaderItem reader={item} ativos={ativosPorLeitor[item.id] || 0} onEdit={onEdit} />, [ativosPorLeitor, onEdit]);

  return (
    <View style={{ flex: 1 }}>
      <View style={s.topo}>
        <TextInput style={s.busca} value={q} onChangeText={setQ} placeholder="Buscar por nome, matrícula ou e-mail" placeholderTextColor={C.mut} accessibilityLabel="Buscar leitores" autoCorrect={false} />
        <Pressable style={s.novo} onPress={() => setForm({ initial: {} })} accessibilityRole="button"><Text style={s.novoTxt}>+ Novo leitor</Text></Pressable>
      </View>
      <Lista data={data} renderItem={render} keyExtractor={r => String(r.id)} otimizada={otimizada} vazio={<Text style={s.vazio}>Nenhum leitor encontrado. Confira a busca ou cadastre um novo leitor.</Text>} />
      <FormModal visible={!!form} title={form?.id ? 'Editar leitor' : 'Novo leitor'} fields={CAMPOS} initial={form?.initial}
        onSubmit={v => salvarLeitor(v, form?.id)} onClose={() => setForm(null)} />
    </View>
  );
}
const s = StyleSheet.create({
  topo: { padding: 14, paddingBottom: 0, gap: 10 },
  busca: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#9DB0B5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  novo: { backgroundColor: C.acc, borderRadius: 8, minHeight: 46, alignItems: 'center', justifyContent: 'center' }, novoTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  vazio: { textAlign: 'center', color: C.mut, padding: 28 }
});
