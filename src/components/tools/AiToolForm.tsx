'use client';
import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

type Field = { key: string; label: string; placeholder?: string };
export function AiToolForm({ task, inputLabel, placeholder, fields = [], minRows = 6 }: {
  task: string; inputLabel: string; placeholder?: string; fields?: Field[]; minRows?: number;
}) {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [input, setInput] = useState('');
  const [opts, setOpts] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [engine, setEngine] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function run() {
    setLoading(true); setOutput('');
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task, input, opts }) });
      const data = await res.json();
      setOutput(data.output || ''); setEngine(data.engine || '');
    } catch { setOutput(fr ? 'Une erreur est survenue.' : 'An error occurred.'); }
    setLoading(false);
  }
  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <div key={f.key}><Label>{f.label}</Label>
          <input value={opts[f.key] || ''} onChange={(e) => setOpts((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></div>
      ))}
      <div><Label>{inputLabel}</Label>
        <Textarea rows={minRows} value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} /></div>
      <Button onClick={run} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} {fr ? 'Générer' : 'Generate'}</Button>
      {output && <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {fr ? 'Copier' : 'Copy'}</Button>
          {engine === 'local' && <span className="text-xs text-muted-foreground">{fr ? 'Mode hors-ligne (sans IA configurée)' : 'Offline mode (no AI configured)'}</span>}
          {engine === 'ai' && <span className="text-xs text-primary">{fr ? 'Généré par IA' : 'AI generated'}</span>}
        </div>
        <pre className="whitespace-pre-wrap rounded-md border bg-muted/40 p-4 text-sm">{output}</pre>
      </div>}
    </div>
  );
}