// Semua perhitungan tanggal berbasis UTC agar tidak terpengaruh timezone server.
const DAY = 86_400_000;
const toMs = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

export const isValidIso = (s: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(s) &&
  !Number.isNaN(toMs(s)) &&
  new Date(toMs(s)).toISOString().slice(0, 10) === s;

export const addDays = (iso: string, n: number): string =>
  new Date(toMs(iso) + n * DAY).toISOString().slice(0, 10);

export const diffDays = (a: string, b: string): number =>
  Math.round((toMs(a) - toMs(b)) / DAY);

export const eachDay = (from: string, to: string): string[] => {
  const out: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
};
