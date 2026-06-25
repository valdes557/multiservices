'use client';
import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function GradeConverterPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [val, setVal] = useState(14);
  const [scale, setScale] = useState<'20' | '100'>('20');

  const pct = scale === '20' ? (val / 20) * 100 : val;
  const on20 = (pct / 100) * 20;
  const gpa = (pct / 100) * 4;
  function letter(p: number) {
    if (p >= 90) return 'A'; if (p >= 80) return 'B'; if (p >= 70) return 'C'; if (p >= 60) return 'D'; return 'F';
  }
  const mention = (p: number) => p >= 80 ? (fr ? 'Très bien' : 'Excellent') : p >= 70 ? (fr ? 'Bien' : 'Good') : p >= 60 ? (fr ? 'Assez bien' : 'Fair') : p >= 50 ? (fr ? 'Passable' : 'Pass') : (fr ? 'Insuffisant' : 'Fail');

  return (
    <ToolLayout title={fr ? "Convertisseur de notes" : "Grade Converter"} description={fr ? "Convertissez une note entre les systèmes /20, /100, GPA et lettres (A-F)." : "Convert a grade between /20, /100, GPA and letter systems (A-F)."} icon={<ArrowLeftRight className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>{fr ? 'Note' : 'Grade'}</Label><Input type="number" value={val} onChange={(e) => setVal(Number(e.target.value))} /></div>
          <div><Label>{fr ? 'Barème' : 'Scale'}</Label>
            <select value={scale} onChange={(e) => setScale(e.target.value as '20' | '100')} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="20">/ 20</option><option value="100">/ 100 (%)</option>
            </select></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">/ 20</p><p className="text-2xl font-bold">{on20.toFixed(2)}</p></div>
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">Pourcentage</p><p className="text-2xl font-bold">{pct.toFixed(1)} %</p></div>
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">GPA / 4</p><p className="text-2xl font-bold text-primary">{gpa.toFixed(2)}</p></div>
          <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{fr ? 'Lettre' : 'Letter'}</p><p className="text-2xl font-bold">{letter(pct)}</p></div>
        </div>
        <p className="text-center text-sm text-muted-foreground">{fr ? 'Mention : ' : 'Grade: '}<span className="font-semibold">{mention(pct)}</span></p>
      </CardContent></Card>
    </ToolLayout>
  );
}