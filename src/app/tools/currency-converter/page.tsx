'use client';
import { useEffect, useMemo, useState } from 'react';
import { Coins, ArrowRightLeft, Loader2 } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { getCurrencies, getLatest, getHistory } from '@/lib/services/currency';

export default function CurrencyConverterPage() {
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [from, setFrom] = useState('EUR');
  const [to, setTo] = useState('USD');
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [history, setHistory] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debouncedAmount = useDebounce(amount, 400);

  useEffect(() => { getCurrencies().then(setCurrencies).catch(() => {}); }, []);

  useEffect(() => {
    const amt = parseFloat(debouncedAmount);
    if (isNaN(amt) || from === to) {
      if (from === to) { setResult(amt); setRate(1); }
      return;
    }
    let active = true;
    setLoading(true); setError('');
    getLatest(from, to, amt)
      .then((d) => { if (!active) return; setResult(d.rates[to]); setRate(d.rates[to] / amt); })
      .catch(() => active && setError('Erreur de conversion. Réessayez.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [from, to, debouncedAmount]);

  useEffect(() => {
    if (from === to) { setHistory([]); return; }
    getHistory(from, to, 30).then(setHistory).catch(() => setHistory([]));
  }, [from, to]);

  const chart = useMemo(() => {
    if (history.length < 2) return null;
    const vals = history.map((h) => h.value);
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 1;
    const path = history.map((h, i) => {
      const x = (i / (history.length - 1)) * 100;
      const y = 100 - ((h.value - min) / range) * 100;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');
    return { path, min, max };
  }, [history]);

  const opts = Object.keys(currencies);
  const swap = () => { setFrom(to); setTo(from); };

  return (
    <ToolLayout title="Convertisseur de devises" description="Conversion en temps réel de toutes les devises avec historique des taux sur 30 jours." icon={<Coins className="h-7 w-7" />}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>De</Label>
                <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {opts.map((c) => <option key={c} value={c}>{c} — {currencies[c]}</option>)}
                </select>
              </div>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-lg" />
            </div>
            <Button variant="outline" size="icon" onClick={swap} className="mb-0.5"><ArrowRightLeft className="h-4 w-4" /></Button>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Vers</Label>
                <select value={to} onChange={(e) => setTo(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {opts.map((c) => <option key={c} value={c}>{c} — {currencies[c]}</option>)}
                </select>
              </div>
              <div className="flex h-10 items-center gap-2 rounded-md border bg-primary/5 px-3 text-lg font-bold text-primary">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (result !== null ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(result) + ' ' + to : '—')}
              </div>
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {rate !== null && !error && <p className="mt-3 text-sm text-muted-foreground">1 {from} = {new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 4 }).format(rate)} {to}</p>}
        </CardContent>
      </Card>

      {chart && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Historique (30 jours) — {from}/{to}</CardTitle></CardHeader>
          <CardContent>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-48 w-full rounded-lg border bg-card">
              <path d={chart.path} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Min : {chart.min.toFixed(4)}</span><span>Max : {chart.max.toFixed(4)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </ToolLayout>
  );
}