'use client';
import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function PercentageCalculatorPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [a, setA] = useState(25);
  const [b, setB] = useState(200);
  const [from, setFrom] = useState(80);
  const [to, setTo] = useState(120);

  const pctOf = (a / 100) * b;
  const isWhatPct = b ? (a / b) * 100 : 0;
  const variation = from ? ((to - from) / from) * 100 : 0;
  const fmt = (x: number) => x.toLocaleString(fr ? 'fr-FR' : 'en-US', { maximumFractionDigits: 2 });

  return (
    <ToolLayout title={fr ? "Calculateur de pourcentages" : "Percentage Calculator"} description={fr ? "Calculez pourcentages, augmentations, réductions et variations en un clic." : "Calculate percentages, increases, discounts and variations in one click."} icon={<Calculator className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <p className="font-medium">{fr ? 'Combien font X % de Y ?' : 'What is X % of Y?'}</p>
          <div className="flex items-center gap-2">
            <Input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-24" /> %
            {fr ? 'de' : 'of'}
            <Input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-32" />
            <span className="ml-2 font-bold text-primary">= {fmt(pctOf)}</span>
          </div>
          <p className="text-sm text-muted-foreground">{fr ? 'Soit ' : 'That is '}<span className="font-semibold">{fmt(isWhatPct)} %</span>{fr ? ' (X représente ce % de Y)' : ' (X is this % of Y)'}</p>
        </div>
        <div className="space-y-2 border-t pt-4">
          <p className="font-medium">{fr ? 'Variation en pourcentage' : 'Percentage change'}</p>
          <div className="flex items-center gap-2">
            {fr ? 'de' : 'from'}
            <Input type="number" value={from} onChange={(e) => setFrom(Number(e.target.value))} className="w-28" />
            {fr ? 'à' : 'to'}
            <Input type="number" value={to} onChange={(e) => setTo(Number(e.target.value))} className="w-28" />
            <span className={'ml-2 font-bold ' + (variation >= 0 ? 'text-green-600' : 'text-red-600')}>{variation >= 0 ? '+' : ''}{fmt(variation)} %</span>
          </div>
        </div>
      </CardContent></Card>
    </ToolLayout>
  );
}