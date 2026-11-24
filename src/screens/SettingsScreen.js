import { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch, StyleSheet, ScrollView } from 'react-native';
import { aviso, confirmar } from '../dialog';
import { C } from '../theme';

// RN05 (prazo) + ferramentas para medir desempenho (comparativo antes/depois)
export default function SettingsScreen({ lib, otimizada, setOtimizada }) {
  const [prazo, setPrazo] = useState(String(lib.db.prazo));
  const salvar = async () => { const e = await lib.definirPrazo(Number(prazo)); aviso(e ? 'Prazo' : 'Pronto', e || 'Prazo atualizado para os próximos empréstimos.'); };
  const gerar = async () => { const t0 = Date.now(); const e = await lib.gerarTeste(); aviso(e ? 'Erro' : 'Acervo de teste criado', e || `+5.000 livros em ${Date.now() - t0} ms.`); };
  const reset = () => confirmar('Restaurar dados', 'Apaga tudo e volta aos dados de exemplo. Continuar?', 'Restaurar', () => lib.restaurar());

  return (
    <ScrollView contentContainerStyle={{ padding: 14, gap: 14 }}>
      <View style={s.card}>
        <Text style={s.h}>Prazo de empréstimo</Text>
        <Text style={s.p}>Dias para devolução (vale para novos empréstimos).</Text>
        <View style={s.linha}>
          <TextInput style={s.input} value={prazo} onChangeText={setPrazo} keyboardType="number-pad" accessibilityLabel="Prazo em dias" />
          <Pressable style={s.btn} onPress={salvar}><Text style={s.btnTxt}>Salvar prazo</Text></Pressable>
        </View>
      </View>
      <View style={s.card}>
        <Text style={s.h}>Teste de desempenho</Text>
        <Text style={s.p}>Livros no acervo: {lib.db.books.length}. Gere 5.000 livros e alterne o tipo de lista para comparar a rolagem e a busca.</Text>
        <View style={s.linha}><Text style={[s.p, { flex: 1, color: C.ink }]}>Lista otimizada (FlatList)</Text><Switch value={otimizada} onValueChange={setOtimizada} trackColor={{ true: C.acc }} /></View>
        <Pressable style={s.btn} onPress={gerar}><Text style={s.btnTxt}>Gerar 5.000 livros de teste</Text></Pressable>
        <Pressable style={[s.btn, s.sec]} onPress={reset}><Text style={[s.btnTxt, { color: C.bad }]}>Restaurar dados de exemplo</Text></Pressable>
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: C.line, padding: 14, gap: 10 },
  h: { fontSize: 17, fontWeight: '700', color: C.ink }, p: { fontSize: 14, color: C.mut }, linha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#9DB0B5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  btn: { backgroundColor: C.acc, borderRadius: 8, minHeight: 46, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' }, btnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sec: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.bad }
});
