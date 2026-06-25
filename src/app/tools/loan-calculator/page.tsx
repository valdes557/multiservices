'use client';
import { useMemo, useState } from 'react';
import { Landmark } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Row { month: number; payment: number; principal: number; interest: number; balance: number; }

function computeAmortization(amount: number, annualRate: number, years: number) {
  const n = Math.max(1, Math.round(years * 12));
  const r = annualRate / 100 / 12;
  const monthly = r === 0 ? amount / n : (amount * r) / (1 - Math.pow(1 + r, -n));
  const rows: Row[] = [];
  let balance = amount;
  let totalInterest = 0;
  for (let m = 1; m <= n; m++) {
    const interest = balance * r;
    const principal = monthly - interest;
    balance = Math.max(0, balance - principal);
    totalInterest += interest;
    rows.push({ month: m, payment: monthly, principal, interest, balance });
  }
  return { monthly, n, totalInterest, totalCost: monthly * n, rows };
}

const fmt = (v: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

export default function LoanCalculatorPage() {
  const [amount, setAmount] = useState(200000);
  const [rate, setRate] = useState(3.5);
  const [years, setYears] = useState(20);
  const res = useMemo(() => computeAmortization(amount, rate, years), [amount, rate, years]);

  // Donut principal vs intérêts
  const principalPct = (amount / res.totalCost) * 100;
  const circ = 2 * Math.PI * 60;

  // Courbe du capital restant dû
  const step = Math.max(1, Math.floor(res.rows.length / 60));
  const pts = res.rows.filter((_, i) => i % step === 0 || i === res.rows.length - 1);
  const maxBal = amount;
  const path = pts.map((row, i) => {
    const x = (i / (pts.length - 1)) * 100;
    const y = 100 - (row.balance / maxBal) * 100;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');

  return (
    <ToolLayout title="Calculateur de prêt" description="Calculez vos mensualités, intérêts, coût total et visualisez le tableau d'amortissement." icon={<Landmark className="h-7 w-7" />}>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Paramètres</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Montant emprunté (€)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Taux annuel (%)</Label>
              <Input type="number" step="0.01" value={rate} onChange={(e) => setRate(+e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Durée (années)</Label>
              <Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Résultats</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Mensualité" value={fmt(res.monthly)} accent />
              <Stat label="Nombre de paiements" value={String(res.n)} />
              <Stat label="Total intérêts" value={fmt(res.totalInterest)} />
              <Stat label="Coût total" value={fmt(res.totalCost)} />
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="hsl(var(--muted))" strokeWidth="16" />
                  <circle cx="70" cy="70" r="60" fill="none" stroke="hsl(var(--primary))" strokeWidth="16"
                    strokeDasharray={`${(principalPct / 100) * circ} ${circ}`} strokeLinecap="round" />
                </svg>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary" /> Capital : {fmt(amount)}</div>
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-muted" /> Intérêts : {fmt(res.totalInterest)}</div>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Capital restant dû</p>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full rounded-lg border bg-card">
                  <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Tableau d'amortissement</CardTitle></CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted"><tr>
                <th className="p-2 text-left">Mois</th><th className="p-2 text-right">Mensualité</th>
                <th className="p-2 text-right">Capital</th><th className="p-2 text-right">Intérêts</th><th className="p-2 text-right">Restant dû</th>
              </tr></thead>
              <tbody>
                {res.rows.map((row) => (
                  <tr key={row.month} className="border-t">
                    <td className="p-2">{row.month}</td>
                    <td className="p-2 text-right">{fmt(row.payment)}</td>
                    <td className="p-2 text-right">{fmt(row.principal)}</td>
                    <td className="p-2 text-right">{fmt(row.interest)}</td>
                    <td className="p-2 text-right">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${accent ? 'bg-primary/5 border-primary/30' : ''}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}