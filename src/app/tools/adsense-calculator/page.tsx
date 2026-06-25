'use client';
import { useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const fmt = (v: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(v);

export default function AdsenseCalculatorPage() {
  const [visitors, setVisitors] = useState(50000); // visiteurs mensuels
  const [ctr, setCtr] = useState(2);   // %
  const [cpc, setCpc] = useState(0.35); // $

  const r = useMemo(() => {
    const clicksMonthly = visitors * (ctr / 100);
    const monthly = clicksMonthly * cpc;
    const daily = monthly / 30;
    const yearly = monthly * 12;
    const rpm = visitors > 0 ? (monthly / visitors) * 1000 : 0;
    return { clicksMonthly, daily, monthly, yearly, rpm };
  }, [visitors, ctr, cpc]);

  // Barres 12 mois (croissance projetée légère + variation)
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  const series = months.map((_, i) => r.monthly * (0.85 + (i % 3) * 0.06 + i * 0.01));
  const maxV = Math.max(...series, 1);

  return (
    <ToolLayout title="Vérificateur de rentabilité AdSense" description="Estimez vos revenus AdSense à partir de votre trafic, CTR et CPC moyen." icon={<TrendingUp className="h-7 w-7" />}>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Vos données</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Visiteurs mensuels</Label>
              <Input type="number" value={visitors} onChange={(e) => setVisitors(+e.target.value)} /></div>
            <div className="space-y-1.5"><Label>CTR (%)</Label>
              <Input type="number" step="0.1" value={ctr} onChange={(e) => setCtr(+e.target.value)} /></div>
            <div className="space-y-1.5"><Label>CPC moyen ($)</Label>
              <Input type="number" step="0.01" value={cpc} onChange={(e) => setCpc(+e.target.value)} /></div>
            <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">≈ {Math.round(r.clicksMonthly).toLocaleString('fr-FR')} clics/mois · RPM ≈ {fmt(r.rpm)}</p>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Metric label="Revenus quotidiens" value={fmt(r.daily)} />
            <Metric label="Revenus mensuels" value={fmt(r.monthly)} accent />
            <Metric label="Revenus annuels" value={fmt(r.yearly)} />
          </div>
          <Card>
            <CardHeader><CardTitle>Projection sur 12 mois</CardTitle></CardHeader>
            <CardContent>
              <div className="flex h-48 items-end gap-1.5">
                {series.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary" style={{ height: `${(v / maxV) * 100}%` }} title={fmt(v)} />
                    <span className="text-[10px] text-muted-foreground">{months[i]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card className={accent ? 'border-primary/40 bg-primary/5' : ''}>
      <CardContent className="pt-6">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}