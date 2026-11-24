import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useLibrary } from './src/useLibrary';
import FormModal from './src/FormModal';
import BooksScreen from './src/screens/BooksScreen';
import ReadersScreen from './src/screens/ReadersScreen';
import LoansScreen from './src/screens/LoansScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { C } from './src/theme';

const ADMIN = { u: 'admin', p: 'admin123' }; // acesso de demonstração (RNF03)
const LOGIN = [{ n: 'u', l: 'Usuário' }, { n: 'p', l: 'Senha', secret: true }];
const ABAS_ADMIN = [['livros', 'Livros'], ['leitores', 'Leitores'], ['emprestimos', 'Empréstimos'], ['atrasos', 'Atrasos'], ['ajustes', 'Ajustes']];

export default function App() {
  const lib = useLibrary();
  const [admin, setAdmin] = useState(false);
  const [aba, setAba] = useState('livros');
  const [login, setLogin] = useState(false);
  const [otimizada, setOtimizada] = useState(true);

  if (!lib.db) return <View style={s.splash}><ActivityIndicator size="large" color={C.gold} /></View>;

  const entrar = async v => {
    if (v.u !== ADMIN.u || v.p !== ADMIN.p) return 'Usuário ou senha incorretos.';
    setAdmin(true); setAba('livros'); return null;
  };
  const sair = () => { setAdmin(false); setAba('livros'); };
  const tela = !admin ? 'livros' : aba; // RN01 / RNF03: leitor só vê o catálogo

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={s.raiz} edges={['top', 'bottom']}>
        <View style={s.cabecalho}>
          <View>
            <Text style={s.marca}>Biblioteca</Text>
            <Text style={s.modo}>{admin ? 'Bibliotecário' : 'Catálogo (modo leitor)'}</Text>
          </View>
          <Pressable style={s.entrar} onPress={admin ? sair : () => setLogin(true)} accessibilityRole="button">
            <Text style={s.entrarTxt}>{admin ? 'Sair' : 'Entrar'}</Text>
          </Pressable>
        </View>

        <View style={s.corpo}>
          {tela === 'livros' && <BooksScreen lib={lib} admin={admin} otimizada={otimizada} />}
          {tela === 'leitores' && <ReadersScreen lib={lib} otimizada={otimizada} />}
          {tela === 'emprestimos' && <LoansScreen lib={lib} otimizada={otimizada} />}
          {tela === 'atrasos' && <LoansScreen lib={lib} fixo="atrasados" otimizada={otimizada} />}
          {tela === 'ajustes' && <SettingsScreen lib={lib} otimizada={otimizada} setOtimizada={setOtimizada} />}
        </View>

        {admin && (
          <View style={s.abas} accessibilityRole="tablist">
            {ABAS_ADMIN.map(([k, l]) => (
              <Pressable key={k} style={[s.aba, aba === k && s.abaOn]} onPress={() => setAba(k)} accessibilityRole="tab" accessibilityState={{ selected: aba === k }}>
                <Text style={[s.abaTxt, aba === k && { color: '#fff', fontWeight: '700' }]} numberOfLines={1}>{l}</Text>
                {k === 'atrasos' && lib.atrasados > 0 && <View style={s.badge}><Text style={s.badgeTxt}>{lib.atrasados}</Text></View>}
              </Pressable>
            ))}
          </View>
        )}
      </SafeAreaView>
      <FormModal visible={login} title="Entrar como bibliotecário" fields={LOGIN} initial={{}} submitLabel="Entrar"
        dica="Acesso de demonstração: admin / admin123" onSubmit={entrar} onClose={() => setLogin(false)} />
    </SafeAreaProvider>
  );
}
const s = StyleSheet.create({
  splash: { flex: 1, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  raiz: { flex: 1, backgroundColor: C.ink }, corpo: { flex: 1, backgroundColor: C.paper },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  marca: { color: '#fff', fontSize: 24, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }, modo: { color: '#BFD0D4', fontSize: 13 },
  entrar: { borderWidth: 1, borderColor: '#ffffff88', borderRadius: 8, paddingHorizontal: 14, minHeight: 40, justifyContent: 'center' }, entrarTxt: { color: '#fff', fontWeight: '600' },
  abas: { flexDirection: 'row', backgroundColor: C.ink }, aba: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', borderTopWidth: 3, borderTopColor: 'transparent' },
  abaOn: { borderTopColor: C.gold, backgroundColor: '#ffffff22' }, abaTxt: { color: '#BFD0D4', fontSize: 11.5 },
  badge: { position: 'absolute', top: 6, right: 6, backgroundColor: C.bad, borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center' }, badgeTxt: { color: '#fff', fontSize: 11, fontWeight: '700' }
});
