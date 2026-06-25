'use client';
import { useState } from 'react';
import { Fingerprint, Copy, Check, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

function uuidv4() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0; const v = c === 'x' ? r : (r & 0x3) | 0x8; return v.toString(16);
  });
}
export default function UuidGeneratorPage() {
  const { locale } = useLocale();
  const en = locale === 'en';
  const S = en
    ? { title:'UUID Generator', desc:'Generate random v4 UUIDs in bulk.', count:'How many', gen:'Generate', copyAll:'Copy all', copied:'Copied' }
    : { title:'Generateur UUID', desc:'Generez des UUID v4 aleatoires en masse.', count:'Combien', gen:'Generer', copyAll:'Tout copier', copied:'Copie' };
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const gen = () => setList(Array.from({ length: Math.min(100, Math.max(1, count)) }, uuidv4));
  const copyAll = () => { navigator.clipboard.writeText(list.join('\n')); setCopied(true); setTimeout(()=>setCopied(false),1500); };
  return (
    <ToolLayout title={S.title} description={S.desc} icon={<Fingerprint className="h-7 w-7" />}>
      <Card><CardContent className="p-4">
        <div className="flex items-end gap-3">
          <div className="space-y-1.5"><Label>{S.count}</Label><Input type="number" min={1} max={100} value={count} onChange={(e)=>setCount(+e.target.value)} className="w-32" /></div>
          <Button onClick={gen}><RefreshCw className="mr-2 h-4 w-4" />{S.gen}</Button>
          {list.length > 0 && <Button variant="outline" onClick={copyAll}>{copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}{copied ? S.copied : S.copyAll}</Button>}
        </div>
        {list.length > 0 && <div className="mt-4 space-y-2">{list.map((u)=>(<div key={u} className="rounded-md border bg-muted/40 px-3 py-2 font-mono text-sm">{u}</div>))}</div>}
      </CardContent></Card>
    </ToolLayout>
  );
}