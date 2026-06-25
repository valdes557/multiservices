'use client';
import { useState } from 'react';
import { Binary, Copy, Check } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocale } from '@/context/LocaleContext';

export default function Base64Page() {
  const { locale } = useLocale();
  const en = locale === 'en';
  const S = en
    ? { title:'Base64 Encoder / Decoder', desc:'Encode and decode text to Base64 (UTF-8).', input:'Input', out:'Result', enc:'Encode', dec:'Decode', copy:'Copy', copied:'Copied', err:'Invalid Base64' }
    : { title:'Encodeur / Decodeur Base64', desc:'Encodez et decodez du texte en Base64 (UTF-8).', input:'Source', out:'Resultat', enc:'Encoder', dec:'Decoder', copy:'Copier', copied:'Copie', err:'Base64 invalide' };
  const [input, setInput] = useState('Bonjour MultiServices !');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const enc = () => { try { setOutput(btoa(unescape(encodeURIComponent(input)))); setError(''); } catch { setError(S.err); } };
  const dec = () => { try { setOutput(decodeURIComponent(escape(atob(input)))); setError(''); } catch { setError(S.err); setOutput(''); } };
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false),1500); };
  return (
    <ToolLayout title={S.title} description={S.desc} icon={<Binary className="h-7 w-7" />}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardContent className="p-4">
          <p className="mb-2 text-sm font-medium">{S.input}</p>
          <Textarea value={input} onChange={(e)=>setInput(e.target.value)} className="h-60 font-mono text-sm" />
          <div className="mt-3 flex gap-2">
            <Button onClick={enc}><Binary className="mr-2 h-4 w-4" />{S.enc}</Button>
            <Button variant="outline" onClick={dec}>{S.dec}</Button>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">{S.out}</p>
            {output && <Button size="sm" variant="ghost" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? S.copied : S.copy}</Button>}
          </div>
          {error
            ? <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            : <pre className="h-60 overflow-auto rounded-md border bg-muted/40 p-3 font-mono text-sm break-all whitespace-pre-wrap">{output || '—'}</pre>}
        </CardContent></Card>
      </div>
    </ToolLayout>
  );
}