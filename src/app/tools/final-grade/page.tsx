'use client';
import { useState } from 'react';
import { Target } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function FinalGradePage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [current, setCurrent] = useState(12);
  const [target, setTarget] = useState(14);
  const [weight, setWeight] = useState(40);

  const w = weight / 100;
  const needed = w > 0 ? (target - current * (1 - w)) / w : 0;
  const possible = needed <= 20 && needed >= 0;
  const fmt = (x: number) => x.toFixed(2);

  return (
    <ToolLayout title={fr ? "Calculateur de note finale" : "Final Grade Calculator"} description={fr ? "Déterminez la note nécessaire à l’examen final pour atteindre votre objectif." : "Find the grade needed on the final exam to reach your target."} icon={<Target className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div><Label>{fr ? 'Moyenne actuelle / 20' : 'Current average / 20'}</Label><Input type="number" value={current} onChange={(e) => setCurrent(Number(e.target.value))} /></div>
          <div><Label>{fr ? 'Objectif / 20' : 'Target / 20'}</Label><Input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} /></div>
          <div><Label>{fr ? 'Poids examen (%)' : 'Exam weight (%)'}</Label><Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} /></div>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <p className="text-xs text-muted-foreground">{fr ? 'Note nécessaire à l’examen' : 'Grade needed on exam'}</p>
          <p className={'text-3xl font-bold ' + (possible ? 'text-primary' : 'text-red-600')}>{fmt(Math.max(0, needed))} / 20</p>
          {!possible && <p className="mt-1 text-sm text-red-600">{needed > 20 ? (fr ? 'Objectif impossible à atteindre.' : 'Target not achievable.') : (fr ? 'Objectif déjà atteint !' : 'Target already reached!')}</p>}
        </div>
      </CardContent></Card>
    </ToolLayout>
  );
}