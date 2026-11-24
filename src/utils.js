export const hoje = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
export const somar = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
export const br = iso => (iso ? iso.split('-').reverse().join('/') : '');
export const norm = v => String(v).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const dias = prazo => Math.round((new Date(hoje()) - new Date(prazo)) / 864e5);
