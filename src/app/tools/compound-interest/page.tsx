'use client';
import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function CompoundInterestPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [principal, setPrincipal] = useState(1000);
  const [monthly, setMonthly] = useState(100);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);

  const r = rate / 100 / 12;
  const n = years * 12;
  let balance = principal;
  let invested = principal;
  for (let i = 0; i < n; i++) { balance = balance * (1 + r) + monthly; invested += monthly; }
  const interest = balance - invested;
  const fmt = (x: number) => x.toLocaleString(fr ? 'fr-FR' : 'en-US', { maximumFractionDigits: 0 });

  return (
    <ToolLayout title={fr ? "Calculateur d’intérêts composés" : "Compound Interest Calculator"} description={fr ? "Calculez la croissance de votre capital avec intérêts composés et versements réguliers." : "Calculate your capital growth with compound interest and regular contributions."} icon={<TrendingUp className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>{fr ? 'Capital initial (€)' : 'Initial capital (€)'}</Label><Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} /></div>
          <div><Label>{fr ? 'Versement mensuel (€)' : 'Monthly contribution (€)'}</Label><Input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} /></div>
          <div><Label>{fr ? 'Taux annuel (%)' : 'Annual rate (%)'}</Label><Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></div>
          <div><Label>{fr ? 'Durée (années)' : 'Duration (years)'}</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{fr ? 'Capital final' : 'Final balance'}</p><p className="text-2xl font-bold text-primary">{fmt(balance)} €</p></div>
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{fr ? 'Total investi' : 'Total invested'}</p><p className="text-2xl font-bold">{fmt(invested)} €</p></div>
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{fr ? 'Intérêts gagnés' : 'Interest earned'}</p><p className="text-2xl font-bold text-green-600">{fmt(interest)} €</p></div>
        </div>
      </CardContent></Card>
    </ToolLayout>
  );
}