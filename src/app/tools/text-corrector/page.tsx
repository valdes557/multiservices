'use client';
import { useState } from 'react';
import { SpellCheck, Wand2, Copy, Loader2, Check } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { modeLabels, transformText } from '@/lib/textTools';
import type { TextMode } from '@/lib/textTools';
import { useLocale } from '@/context/LocaleContext';

const modes = Object.keys(modeLabels) as TextMode[];

export default function TextCorrectorPage() {
  const { locale } = useLocale();
  const en = locale === 'en';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<TextMode>('grammar');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function run(m: TextMode) {
    setMode(m);
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: input, mode: m }) });
      const data = await res.json();
      setOutput(data.result || transformText(input, m));
    } catch {
      setOutput(transformText(input, m)); // fallback hors-ligne
    } finally { setLoading(false); }
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }

  const words = input.trim() ? input.trim().split(/\s+/).length : 0;

  return (
    <ToolLayout title={en ? 'Text correction & rewriting' : 'Correction & reformulation de texte'} description={en ? 'Correct and rewrite your texts: spelling, grammar, rephrasing, simplification, formal, persuasive.' : 'Corrigez et réécrivez vos textes : orthographe, grammaire, reformulation, simplification, formel, persuasif.'} icon={<SpellCheck className="h-7 w-7" />}>
      <div className="mb-6 flex flex-wrap gap-2">
        {modes.map((m) => (
          <Button key={m} variant={mode === m ? 'default' : 'outline'} size="sm" onClick={() => run(m)}>
            <Wand2 className="mr-2 h-3.5 w-3.5" /> {modeLabels[m]}
          </Button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>{en ? 'Your text' : 'Votre texte'}</CardTitle>
            <span className="text-xs text-muted-foreground">{words} {en ? 'words' : 'mots'}</span>
          </CardHeader>
          <CardContent>
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} placeholder={en ? 'Paste or write your text here...' : 'Collez ou écrivez votre texte ici...'} className="resize-none" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>{en ? 'Result' : 'Résultat'} — {modeLabels[mode]}</CardTitle>
            <Button size="sm" variant="outline" onClick={copy} disabled={!output}>
              {copied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />} {copied ? (en ? 'Copied' : 'Copié') : (en ? 'Copy' : 'Copier')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[336px] whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
              {loading ? <span className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> {en ? 'Processing…' : 'Traitement…'}</span> : (output || <span className="text-muted-foreground">{en ? 'The result will appear here. Choose a mode above.' : 'Le résultat apparaîtra ici. Choisissez un mode ci-dessus.'}</span>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}