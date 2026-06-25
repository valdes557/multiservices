'use client';
import { useState } from 'react';
import { Key, Copy, Check, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

function rand(n: number) { const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; const a = new Uint32Array(n); crypto.getRandomValues(a); return Array.from(a, (x) => c[x % c.length]).join(''); }
const formats: Record<string, () => string> = {
  'Standard (sk_)': () => 'sk_live_' + rand(32),
  'Bearer Token': () => rand(40),
  'UUID': () => (crypto.randomUUID ? crypto.randomUUID() : rand(36)),
  'Hex (64)': () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (b)=>b.toString(16).padStart(2,'0')).join(''),
  'Prefixed (mk_)': () => 'mk_' + rand(28),
};
export default function ApiKeyGeneratorPage() {
  const { locale } = useLocale();
  const en = locale === 'en';
  const S = en
    ? { title:'Mock API Key Generator', desc:'Generate fake API keys & tokens for testing.', fmt:'Format', gen:'Generate', copy:'Copy', copied:'Copied', note:'For testing only — these keys are random and not linked to any service.' }
    : { title:'Generateur de cles API fictives', desc:'Generez des cles API et tokens fictifs pour vos tests.', fmt:'Format', gen:'Generer', copy:'Copier', copied:'Copie', note:'Pour tests uniquement — ces cles sont aleatoires et ne sont liees a aucun service.' };
  const [fmt, setFmt] = useState('Standard (sk_)');
  const [key, setKey] = useState(formats['Standard (sk_)']());
  const [copied, setCopied] = useState(false);
  const gen = () => setKey(formats[fmt]());
  const copy = () => { navigator.clipboard.writeText(key); setCopied(true); setTimeout(()=>setCopied(false),1500); };
  return (
    <ToolLayout title={S.title} description={S.desc} icon={<Key className="h-7 w-7" />}>
      <Card><CardContent className="space-y-5 p-5">
        <div className="space-y-1.5"><Label>{S.fmt}</Label>
          <select value={fmt} onChange={(e)=>{ setFmt(e.target.value); }} className="h-10 w-full rounded-md border bg-background px-3 text-sm">
            {Object.keys(formats).map((f)=>(<option key={f} value={f}>{f}</option>))}
          </select>
        </div>
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
          <span className="flex-1 break-all font-mono text-sm">{key}</span>
          <Button size="sm" variant="ghost" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
        </div>
        <Button onClick={gen} className="w-full"><RefreshCw className="mr-2 h-4 w-4" />{S.gen}</Button>
        <p className="text-xs text-muted-foreground">⚠️ {S.note}</p>
      </CardContent></Card>
    </ToolLayout>
  );
}