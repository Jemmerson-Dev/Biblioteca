import { useCallback, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { aviso } from '../dialog';
import Lista from '../Lista';
import { LoanItem } from '../Items';
import FormModal from '../FormModal';
import { hoje } from '../utils';
import { C } from '../theme';

const VAZIO = {};
const CAMPOS = [{ n: 'mat', l: 'Matrícula do leitor' }, { n: 'tit', l: 'Título do livro' }];
const FILTROS = [['todos', 'Todos'], ['ativos', 'Em andamento'], ['atrasados', 'Atrasados'], ['devolvidos', 'Devolvidos']];

// RF04 (empréstimo/devolução), RF06 (atrasos) e RF07 (consulta de registros). fixo='atrasados' vira a aba Atrasos.
export default function LoansScreen({ lib, fixo, otimizada }) {
  const [f, setF] = useState(fixo || 'todos'); const [form, setForm] = useState(false);
  const { db, livros, leitores, emprestar, devolver } = lib;
  const filtro = fixo || f;

  const data = useMemo(() => {
    const h = hoje();
    return db.loans.filter(l => filtro === 'todos' || (filtro === 'ativos' && !l.dev) || (filtro === 'atrasados' && !l.dev && l.prazo < h) || (filtro === 'devolvidos' && l.dev)).sort((a, b) => b.id - a.id);
  }, [db.loans, filtro]);
  const onReturn = useCallback(async id => { const e = await devolver(id); if (e) aviso('Devolução', e); }, [devolver]);
  const render = useCallback(({ item }) => <LoanItem loan={item} titulo={livros.get(item.bookId)?.titulo ?? '(livro removido)'} leitor={leitores.get(item.readerId)?.nome ?? '(leitor removido)'} onReturn={onReturn} />, [livros, leitores, onReturn]);

  return (
    <View style={{ flex: 1 }}>
      <View style={s.topo}>
        {!fixo && <Pressable style={s.novo} onPress={() => setForm(true)} accessibilityRole="button"><Text style={s.novoTxt}>+ Registrar empréstimo</Text></Pressable>}
        {!fixo && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {FILTROS.map(([k, l]) => (
              <Pressable key={k} onPress={() => setF(k)} style={[s.chip, f === k && s.chipOn]} accessibilityRole="button" accessibilityState={{ selected: f === k }}>
                <Text style={[s.chipTxt, f === k && { color: '#fff' }]}>{l}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
      <Lista data={data} renderItem={render} keyExtractor={l => String(l.id)} otimizada={otimizada} vazio={<Text style={s.vazio}>Nenhum empréstimo nesta lista.</Text>} />
      <FormModal visible={form} title="Registrar empréstimo" fields={CAMPOS} initial={VAZIO} submitLabel="Registrar"
        dica={`Prazo atual: ${db.prazo} dias.`} onSubmit={emprestar} onClose={() => setForm(false)} />
    </View>
  );
}
const s = StyleSheet.create({
  topo: { padding: 14, paddingBottom: 0, gap: 10 },
  novo: { backgroundColor: C.acc, borderRadius: 8, minHeight: 46, alignItems: 'center', justifyContent: 'center' }, novoTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  chip: { borderWidth: 1, borderColor: C.acc, borderRadius: 99, paddingHorizontal: 14, minHeight: 38, justifyContent: 'center' }, chipOn: { backgroundColor: C.acc }, chipTxt: { color: C.acc, fontWeight: '600' },
  vazio: { textAlign: 'center', color: C.mut, padding: 28 }
});
