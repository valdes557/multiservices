'use client';
import { useState } from 'react';
import { FileCode, Copy, Check, ArrowRightLeft } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocale } from '@/context/LocaleContext';

function jsonToXml(obj: any, indent = ''): string {
  if (obj === null || obj === undefined) return '';
  if (Array.isArray(obj)) return obj.map((it) => indent + '<item>' + (typeof it === 'object' ? '\n' + jsonToXml(it, indent + '  ') + '\n' + indent : it) + '</item>').join('\n');
  if (typeof obj === 'object') return Object.entries(obj).map(([k, v]) => {
    if (typeof v === 'object' && v !== null) return indent + '<' + k + '>\n' + jsonToXml(v, indent + '  ') + '\n' + indent + '</' + k + '>';
    return indent + '<' + k + '>' + v + '</' + k + '>';
  }).join('\n');
  return indent + String(obj);
}
function xmlToJson(xml: string): any {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid XML');
  const walk = (node: Element): any => {
    const children = Array.from(node.children);
    if (children.length === 0) return node.textContent;
    const out: any = {};
    for (const c of children) {
      const val = walk(c);
      if (out[c.tagName] !== undefined) { if (!Array.isArray(out[c.tagName])) out[c.tagName] = [out[c.tagName]]; out[c.tagName].push(val); }
      else out[c.tagName] = val;
    }
    return out;
  };
  return { [doc.documentElement.tagName]: walk(doc.documentElement) };
}
export default function JsonXmlPage() {
  const { locale } = useLocale();
  const en = locale === 'en';
  const S = en
    ? { title:'JSON / XML Converter', desc:'Convert between JSON and XML both ways.', toXml:'JSON to XML', toJson:'XML to JSON', input:'Input', out:'Result', copy:'Copy', copied:'Copied', err:'Error' }
    : { title:'Convertisseur JSON / XML', desc:'Convertissez entre JSON et XML dans les deux sens.', toXml:'JSON vers XML', toJson:'XML vers JSON', input:'Source', out:'Resultat', copy:'Copier', copied:'Copie', err:'Erreur' };
  const [input, setInput] = useState('{"product":{"name":"Pro","price":29,"tags":["a","b"]}}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const toXml = () => { try { setOutput('<root>\n' + jsonToXml(JSON.parse(input), '  ') + '\n</root>'); setError(''); } catch (e:any){ setError(e.message); setOutput(''); } };
  const toJson = () => { try { setOutput(JSON.stringify(xmlToJson(input), null, 2)); setError(''); } catch (e:any){ setError(e.message); setOutput(''); } };
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false),1500); };
  return (
    <ToolLayout title={S.title} description={S.desc} icon={<FileCode className="h-7 w-7" />}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardContent className="p-4">
          <p className="mb-2 text-sm font-medium">{S.input}</p>
          <Textarea value={input} onChange={(e)=>setInput(e.target.value)} className="h-72 font-mono text-sm" />
          <div className="mt-3 flex gap-2">
            <Button onClick={toXml}><ArrowRightLeft className="mr-2 h-4 w-4" />{S.toXml}</Button>
            <Button variant="outline" onClick={toJson}><ArrowRightLeft className="mr-2 h-4 w-4" />{S.toJson}</Button>
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
        </CardContent></Card>
      </div>
    </ToolLayout>
  );
}