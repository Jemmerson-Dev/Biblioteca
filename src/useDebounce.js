import { useEffect, useState } from 'react';
export function useDebounce(valor, ms = 250) {
  const [v, setV] = useState(valor);
  useEffect(() => { const t = setTimeout(() => setV(valor), ms); return () => clearTimeout(t); }, [valor, ms]); // limpa o timer: sem vazamento
  return v;
}
