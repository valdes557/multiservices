'use client';
import { useMemo, useState } from 'react';
import { Landmark } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

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

export default function LoanCalculatorPage() {
  const { locale } = useLocale();
  const en = locale === 'en';
  const fmt = (v: number) => new Intl.NumberFormat(en ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
  const S = en ? {
    title: 'Loan calculator', desc: 'Compute your monthly payments, interest, total cost and view the amortization schedule.',
    params: 'Parameters', amount: 'Loan amount (€)', rate: 'Annual rate (%)', duration: 'Term (years)',
    results: 'Results', monthly: 'Monthly payment', payments: 'Number of payments', totalInt: 'Total interest', totalCost: 'Total cost',
    principal: 'Principal', interest: 'Interest', remaining: 'Remaining balance', schedule: 'Amortization schedule',
    month: 'Month', balance: 'Balance',
  } : {
    title: 'Calculateur de prêt', desc: "Calculez vos mensualités, intérêts, coût total et visualisez le tableau d'amortissement.",
    params: 'Paramètres', amount: 'Montant emprunté (€)', rate: 'Taux annuel (%)', duration: 'Durée (années)',
    results: 'Résultats', monthly: 'Mensualité', payments: 'Nombre de paiements', totalInt: 'Total intérêts', totalCost: 'Coût total',
    principal: 'Capital', interest: 'Intérêts', remaining: 'Capital restant dû', schedule: "Tableau d'amortissement",
    month: 'Mois', balance: 'Restant dû',
  };

  const [amount, setAmount] = useState(200000);
  const [rate, setRate] = useState(3.5);
  const [years, setYears] = useState(20);
  const res = useMemo(() => computeAmortization(amount, rate, years), [amount, rate, years]);

  const principalPct = (amount / res.totalCost) * 100;
  const circ = 2 * Math.PI * 60;
  const step = Math.max(1, Math.floor(res.rows.length / 60));
  const pts = res.rows.filter((_, i) => i % step === 0 || i === res.rows.length - 1);
  const maxBal = amount;
  const path = pts.map((row, i) => {
    const x = (i / (pts.length - 1)) * 100;
    const y = 100 - (row.balance / maxBal) * 100;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');

  return (
    <ToolLayout title={S.title} description={S.desc} icon={<Landmark className="h-7 w-7" />}>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>{S.params}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>{S.amount}</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} /></div>
            <div className="space-y-1.5"><Label>{S.rate}</Label>
              <Input type="number" step="0.01" value={rate} onChange={(e) => setRate(+e.target.value)} /></div>
            <div className="space-y-1.5"><Label>{S.duration}</Label>
              <Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>{S.results}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label={S.monthly} value={fmt(res.monthly)} accent />
              <Stat label={S.payments} value={String(res.n)} />
              <Stat label={S.totalInt} value={fmt(res.totalInterest)} />
              <Stat label={S.totalCost} value={fmt(res.totalCost)} />
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="hsl(var(--muted))" strokeWidth="16" />
                  <circle cx="70" cy="70" r="60" fill="none" stroke="hsl(var(--primary))" strokeWidth="16"
                    strokeDasharray={`${(principalPct / 100) * circ} ${circ}`} strokeLinecap="round" />
                </svg>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary" /> {S.principal} : {fmt(amount)}</div>
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-muted" /> {S.interest} : {fmt(res.totalInterest)}</div>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">{S.remaining}</p>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full rounded-lg border bg-card">
                  <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>{S.schedule}</CardTitle></CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted"><tr>
                <th className="p-2 text-left">{S.month}</th><th className="p-2 text-right">{S.monthly}</th>
                <th className="p-2 text-right">{S.principal}</th><th className="p-2 text-right">{S.interest}</th><th className="p-2 text-right">{S.balance}</th>
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