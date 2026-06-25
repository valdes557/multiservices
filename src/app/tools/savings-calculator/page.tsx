'use client';
import { useState } from 'react';
import { PiggyBank } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function SavingsCalculatorPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [goal, setGoal] = useState(10000);
  const [current, setCurrent] = useState(0);
  const [months, setMonths] = useState(24);
  const [rate, setRate] = useState(2);

  const remaining = Math.max(0, goal - current);
  const r = rate / 100 / 12;
  let monthly: number;
  if (r === 0) monthly = remaining / months;
  else monthly = (remaining * r) / (Math.pow(1 + r, months) - 1);
  const totalSaved = monthly * months;
  const fmt = (x: number) => x.toLocaleString(fr ? 'fr-FR' : 'en-US', { maximumFractionDigits: 0 });

  return (
    <ToolLayout title={fr ? "Calculateur d’épargne" : "Savings Calculator"} description={fr ? "Estimez combien épargner par mois pour atteindre votre objectif financier." : "Estimate how much to save monthly to reach your financial goal."} icon={<PiggyBank className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>{fr ? 'Objectif (€)' : 'Goal (€)'}</Label><Input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} /></div>
          <div><Label>{fr ? 'Épargne actuelle (€)' : 'Current savings (€)'}</Label><Input type="number" value={current} onChange={(e) => setCurrent(Number(e.target.value))} /></div>
          <div><Label>{fr ? 'Durée (mois)' : 'Duration (months)'}</Label><Input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} /></div>
          <div><Label>{fr ? 'Taux annuel (%)' : 'Annual rate (%)'}</Label><Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{fr ? 'À épargner par mois' : 'Save per month'}</p><p className="text-2xl font-bold text-primary">{fmt(monthly)} €</p></div>
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{fr ? 'Total versé' : 'Total contributed'}</p><p className="text-2xl font-bold">{fmt(totalSaved)} €</p></div>
        </div>
      </CardContent></Card>
    </ToolLayout>
  );
}