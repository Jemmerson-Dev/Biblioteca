import { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { C } from './theme';

// Formulário genérico: valida campos obrigatórios (RNF05) e mantém os dados se der erro.
export default function FormModal({ visible, title, fields, initial, submitLabel = 'Salvar', dica, onSubmit, onClose }) {
  const [v, setV] = useState({}); const [err, setErr] = useState(''); const [bad, setBad] = useState([]); const [busy, setBusy] = useState(false);
  useEffect(() => { if (visible) { setV(initial || {}); setErr(''); setBad([]); } }, [visible, initial]);

  const enviar = async () => {
    const t = Object.fromEntries(fields.map(f => [f.n, String(v[f.n] ?? '').trim()]));
    const falta = fields.filter(f => !t[f.n]);
    setBad(falta.map(f => f.n));
    if (falta.length) return setErr('Preencha os campos obrigatórios: ' + falta.map(f => f.l).join(', ') + '.');
    setBusy(true); const e = await onSubmit(t); setBusy(false);
    if (e) setErr(e); else onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.fundo}>
        <View style={s.painel}>
          <Text style={s.titulo} accessibilityRole="header">{title}</Text>
          {fields.map(f => (
            <View key={f.n} style={s.campo}>
              <Text style={s.rotulo}>{f.l}</Text>
              <TextInput style={[s.input, bad.includes(f.n) && s.invalido]} value={String(v[f.n] ?? '')}
                onChangeText={x => setV(p => ({ ...p, [f.n]: x }))} accessibilityLabel={f.l}
                keyboardType={f.k || 'default'} secureTextEntry={!!f.secret}
                autoCapitalize={f.k === 'email-address' || f.secret || f.n === 'u' || f.n === 'mat' ? 'none' : 'sentences'} autoCorrect={false} />
            </View>
          ))}
          {dica ? <Text style={s.dica}>{dica}</Text> : null}
          <Text style={s.erro} accessibilityLiveRegion="polite">{err}</Text>
          <View style={s.acoes}>
            <Pressable style={[s.btn, s.sec]} onPress={onClose}><Text style={s.secTxt}>Cancelar</Text></Pressable>
            <Pressable style={[s.btn, s.pri, busy && { opacity: 0.6 }]} onPress={enviar} disabled={busy}><Text style={s.priTxt}>{submitLabel}</Text></Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const s = StyleSheet.create({
  fundo: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#12303A99' },
  painel: { backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 20, paddingBottom: 28 },
  titulo: { fontSize: 20, fontWeight: '700', color: C.ink, marginBottom: 12, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  campo: { marginBottom: 12 }, rotulo: { fontSize: 13, fontWeight: '600', color: C.mut, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#9DB0B5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#1B2A2E' },
  invalido: { borderColor: C.bad, borderWidth: 2 },
  dica: { fontSize: 12, color: C.mut, marginBottom: 6 }, erro: { color: C.bad, minHeight: 20, marginBottom: 8, fontSize: 14 },
  acoes: { flexDirection: 'row', gap: 10 }, btn: { flex: 1, minHeight: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  pri: { backgroundColor: C.acc }, priTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  sec: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#9DB0B5' }, secTxt: { color: C.ink, fontWeight: '600', fontSize: 16 }
});
