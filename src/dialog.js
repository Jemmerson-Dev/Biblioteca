import { Alert, Platform } from 'react-native';

// Alert.alert não funciona no navegador; usa window.alert/confirm na web e Alert nativo no celular.
export function aviso(titulo, msg) {
  if (Platform.OS === 'web') window.alert(`${titulo}\n\n${msg}`);
  else Alert.alert(titulo, msg);
}
export function confirmar(titulo, msg, rotulo, onOk) {
  if (Platform.OS === 'web') { if (window.confirm(`${titulo}\n\n${msg}`)) onOk(); return; }
  Alert.alert(titulo, msg, [{ text: 'Cancelar', style: 'cancel' }, { text: rotulo, style: 'destructive', onPress: onOk }]);
}
