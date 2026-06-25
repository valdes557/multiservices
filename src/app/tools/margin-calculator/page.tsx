'use client';
import { useState } from 'react';
import { Percent } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function MarginCalculatorPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [cost, setCost] = useState(50);
  const [price, setPrice] = useState(80);

  const profit = price - cost;
  const margin = price ? (profit / price) * 100 : 0;
  const markup = cost ? (profit / cost) * 100 : 0;
  const fmt = (x: number) => x.toLocaleString(fr ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout title={fr ? "Calculateur de marge" : "Margin Calculator"} description={fr ? "Calculez votre marge commerciale, le taux de marque et le prix de vente optimal." : "Calculate your profit margin, markup rate and optimal selling price."} icon={<Percent className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>{fr ? 'Coût d’achat (€)' : 'Cost price (€)'}</Label><Input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} /></div>
          <div><Label>{fr ? 'Prix de vente (€)' : 'Selling price (€)'}</Label><Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{fr ? 'Profit' : 'Profit'}</p><p className="text-2xl font-bold text-green-600">{fmt(profit)} €</p></div>
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{fr ? 'Taux de marge' : 'Margin rate'}</p><p className="text-2xl font-bold text-primary">{fmt(margin)} %</p></div>
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{fr ? 'Taux de marque' : 'Markup rate'}</p><p className="text-2xl font-bold">{fmt(markup)} %</p></div>
        </div>
      </CardContent></Card>
    </ToolLayout>
  );
}