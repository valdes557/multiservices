'use client';
import { useState } from 'react';
import { Braces, Copy, Check, Minimize2 } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocale } from '@/context/LocaleContext';

export default function JsonFormatterPage() {
  const { locale } = useLocale();
  const en = locale === 'en';
  const S = en
    ? { title:'JSON Formatter', desc:'Format, validate and minify your JSON instantly.', input:'Input JSON', out:'Result', format:'Format', minify:'Minify', copy:'Copy', copied:'Copied', valid:'Valid JSON', err:'Error', ph:'Paste your JSON here...' }
    : { title:'Formateur JSON', desc:'Formatez, validez et minifiez votre JSON instantanement.', input:'JSON source', out:'Resultat', format:'Formater', minify:'Minifier', copy:'Copier', copied:'Copie', valid:'JSON valide', err:'Erreur', ph:'Collez votre JSON ici...' };
  const [input, setInput] = useState('{"name":"MultiServices","tools":42,"active":true}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const run = (minify: boolean) => {
    try { const o = JSON.parse(input); setOutput(JSON.stringify(o, null, minify ? 0 : 2)); setError(''); }
    catch (e: any) { setError(e.message); setOutput(''); }
  };
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false),1500); };
  return (
    <ToolLayout title={S.title} description={S.desc} icon={<Braces className="h-7 w-7" />}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardContent className="p-4">
          <p className="mb-2 text-sm font-medium">{S.input}</p>
          <Textarea value={input} onChange={(e)=>setInput(e.target.value)} placeholder={S.ph} className="h-72 font-mono text-sm" />
          <div className="mt-3 flex gap-2">
            <Button onClick={()=>run(false)}><Braces className="mr-2 h-4 w-4" />{S.format}</Button>
            <Button variant="outline" onClick={()=>run(true)}><Minimize2 className="mr-2 h-4 w-4" />{S.minify}</Button>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">{S.out}</p>
            {output && <Button size="sm" variant="ghost" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? S.copied : S.copy}</Button>}
          </div>
          {error
            ? <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{S.err}: {error}</div>
            : <pre className="h-72 overflow-auto rounded-md border bg-muted/40 p-3 font-mono text-sm">{output || '—'}</pre>}
          {!error && output && <p className="mt-2 text-xs text-green-600">✓ {S.valid}</p>}
        </CardContent></Card>
      </div>
    </ToolLayout>
  );
}