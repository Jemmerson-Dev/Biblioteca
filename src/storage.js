import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'biblioteca-v1';

export async function loadDb(fallback) {
  try { const r = await AsyncStorage.getItem(KEY); return r ? JSON.parse(r) : fallback(); }
  catch { return fallback(); }
}
export async function saveDb(db) {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(db)); return true; }
  catch { return false; }
}
