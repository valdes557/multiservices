'use client';
import { useState } from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/context/LocaleContext';

type Row = { id: number; subject: string; grade: string; coef: string };
export default function GradeAveragePage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [rows, setRows] = useState<Row[]>([
    { id: 1, subject: fr ? 'Maths' : 'Math', grade: '14', coef: '3' },
    { id: 2, subject: fr ? 'Français' : 'English', grade: '12', coef: '2' },
  ]);
  const add = () => setRows((r) => [...r, { id: Date.now(), subject: '', grade: '', coef: '1' }]);
  const remove = (id: number) => setRows((r) => r.filter((x) => x.id !== id));
  const upd = (id: number, k: keyof Row, v: string) => setRows((r) => r.map((x) => x.id === id ? { ...x, [k]: v } : x));

  let totG = 0, totC = 0;
  rows.forEach((r) => { const g = parseFloat(r.grade), c = parseFloat(r.coef); if (!isNaN(g) && !isNaN(c)) { totG += g * c; totC += c; } });
  const avg = totC ? totG / totC : 0;

  return (
    <ToolLayout title={fr ? "Calculateur de moyenne" : "Grade Average Calculator"} description={fr ? "Calculez votre moyenne pondérée par coefficients matière par matière." : "Calculate your weighted average by coefficients subject by subject."} icon={<GraduationCap className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_80px_80px_40px] gap-2 text-xs font-medium text-muted-foreground">
            <span>{fr ? 'Matière' : 'Subject'}</span><span>{fr ? 'Note' : 'Grade'}</span><span>Coef</span><span></span>
          </div>
          {rows.map((r) => (
            <div key={r.id} className="grid grid-cols-[1fr_80px_80px_40px] gap-2 items-center">
              <Input value={r.subject} onChange={(e) => upd(r.id, 'subject', e.target.value)} />
              <Input type="number" value={r.grade} onChange={(e) => upd(r.id, 'grade', e.target.value)} />
              <Input type="number" value={r.coef} onChange={(e) => upd(r.id, 'coef', e.target.value)} />
              <Button variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={add}><Plus className="h-4 w-4" /> {fr ? 'Ajouter' : 'Add'}</Button>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <p className="text-xs text-muted-foreground">{fr ? 'Moyenne générale' : 'Overall average'}</p>
          <p className="text-3xl font-bold text-primary">{avg.toFixed(2)} / 20</p>
        </div>
      </CardContent></Card>
    </ToolLayout>
  );
}