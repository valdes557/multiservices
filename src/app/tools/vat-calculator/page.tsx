'use client';
import { useState } from 'react';
import { Receipt } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function VatCalculatorPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(20);
  const [mode, setMode] = useState<'ht' | 'ttc'>('ht');

  let ht: number, vat: number, ttc: number;
  if (mode === 'ht') { ht = amount; vat = amount * rate / 100; ttc = ht + vat; }
  else { ttc = amount; ht = amount / (1 + rate / 100); vat = ttc - ht; }
  const fmt = (x: number) => x.toLocaleString(fr ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout title={fr ? "Calculateur de TVA" : "VAT Calculator"} description={fr ? "Calculez la TVA, le montant HT et TTC avec différents taux personnalisables." : "Calculate VAT, net and gross amounts with customizable rates."} icon={<Receipt className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div><Label>{fr ? 'Montant (€)' : 'Amount (€)'}</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></div>
          <div><Label>{fr ? 'Taux TVA (%)' : 'VAT rate (%)'}</Label>
            <select value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              {[20, 10, 5.5, 2.1, 0].map((x) => <option key={x} value={x}>{x}%</option>)}
            </select></div>
          <div><Label>{fr ? 'Le montant est' : 'Amount is'}</Label>
            <select value={mode} onChange={(e) => setMode(e.target.value as 'ht' | 'ttc')} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="ht">{fr ? 'Hors taxe (HT)' : 'Net (excl. VAT)'}</option>
              <option value="ttc">{fr ? 'Toutes taxes (TTC)' : 'Gross (incl. VAT)'}</option>
            </select></div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{fr ? 'Montant HT' : 'Net (HT)'}</p><p className="text-2xl font-bold">{fmt(ht)} €</p></div>
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">TVA</p><p className="text-2xl font-bold text-primary">{fmt(vat)} €</p></div>
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{fr ? 'Montant TTC' : 'Gross (TTC)'}</p><p className="text-2xl font-bold text-green-600">{fmt(ttc)} €</p></div>
        </div>
      </CardContent></Card>
    </ToolLayout>
  );
}