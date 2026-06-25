// Service de taux de change basé sur l'API gratuite Frankfurter (sans clé)
const API = 'https://api.frankfurter.app';

export interface RatesResponse { amount: number; base: string; date: string; rates: Record<string, number>; }

export async function getCurrencies(): Promise<Record<string, string>> {
  const res = await fetch(`${API}/currencies`);
  if (!res.ok) throw new Error('Impossible de charger les devises');
  return res.json();
}

export async function getLatest(from: string, to: string, amount = 1): Promise<RatesResponse> {
  const res = await fetch(`${API}/latest?amount=${amount}&from=${from}&to=${to}`);
  if (!res.ok) throw new Error('Conversion impossible');
  return res.json();
}

export async function getHistory(from: string, to: string, days = 30): Promise<{ date: string; value: number }[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const res = await fetch(`${API}/${fmt(start)}..${fmt(end)}?from=${from}&to=${to}`);
  if (!res.ok) throw new Error('Historique indisponible');
  const data = await res.json();
  return Object.entries(data.rates || {})
    .map(([date, r]: [string, any]) => ({ date, value: r[to] as number }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
