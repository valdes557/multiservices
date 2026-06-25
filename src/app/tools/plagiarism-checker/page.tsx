'use client';
import { useState } from 'react';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/context/LocaleContext';

export default function PlagiarismCheckerPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  async function check() {
    if (!text.trim()) return;
    setBusy(true); setNotConfigured(false); setResult(null);
    try {
      const res = await fetch('/api/plagiarism-checker', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      if (res.status === 503) { setNotConfigured(true); setBusy(false); return; }
      const data = await res.json();
      setResult(data);
    } catch { alert(fr ? 'Erreur réseau.' : 'Network error.'); }
    setBusy(false);
  }

  return (
    <ToolLayout title={fr ? "Vérificateur de plagiat" : "Plagiarism Checker"} description={fr ? "Analysez un texte pour détecter le contenu copié (via service de détection)." : "Scan text to detect copied content (via detection service)."} icon={<ShieldCheck className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder={fr ? 'Collez le texte à analyser...' : 'Paste the text to analyze...'} className="w-full rounded-md border bg-background p-3 text-sm" />
        <p className="text-xs text-muted-foreground">{text.trim() ? text.trim().split(/\s+/).length : 0} {fr ? 'mots' : 'words'}</p>
        <Button onClick={check} disabled={busy || !text.trim()}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} {fr ? 'Vérifier le plagiat' : 'Check plagiarism'}</Button>
        {notConfigured && <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800"><AlertCircle className="h-4 w-4 mt-0.5" /><span>{fr ? 'Service non configuré. Ajoutez les variables PLAGIARISM_API_KEY et PLAGIARISM_API_URL pour activer la détection.' : 'Service not configured. Add PLAGIARISM_API_KEY and PLAGIARISM_API_URL to enable detection.'}</span></div>}
        {result && <pre className="rounded-md border bg-muted/40 p-3 text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
      </CardContent></Card>
    </ToolLayout>
  );
}