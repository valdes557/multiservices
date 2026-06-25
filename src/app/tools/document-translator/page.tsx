'use client';
import { useState } from 'react';
import { Languages, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/context/LocaleContext';

const LANGS = [
  { code: 'EN', fr: 'Anglais', en: 'English' },
  { code: 'FR', fr: 'Français', en: 'French' },
  { code: 'ES', fr: 'Espagnol', en: 'Spanish' },
  { code: 'DE', fr: 'Allemand', en: 'German' },
  { code: 'IT', fr: 'Italien', en: 'Italian' },
  { code: 'PT', fr: 'Portugais', en: 'Portuguese' },
  { code: 'NL', fr: 'Néerlandais', en: 'Dutch' },
  { code: 'PL', fr: 'Polonais', en: 'Polish' },
  { code: 'JA', fr: 'Japonais', en: 'Japanese' },
  { code: 'ZH', fr: 'Chinois', en: 'Chinese' },
];

export default function DocumentTranslatorPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [text, setText] = useState('');
  const [target, setTarget] = useState('EN');
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  async function translate() {
    if (!text.trim()) return;
    setBusy(true); setNotConfigured(false); setOut('');
    try {
      const res = await fetch('/api/document-translator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, targetLang: target }) });
      if (res.status === 503) { setNotConfigured(true); setBusy(false); return; }
      const data = await res.json();
      setOut(data.translation || '');
    } catch { alert(fr ? 'Erreur réseau.' : 'Network error.'); }
    setBusy(false);
  }
  function copy() { navigator.clipboard.writeText(out); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <ToolLayout title={fr ? "Traduction de documents" : "Document Translator"} description={fr ? "Traduisez un texte ou document dans plus de 25 langues (via service DeepL)." : "Translate text or documents into 25+ languages (via DeepL service)."} icon={<Languages className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder={fr ? 'Collez votre texte ici...' : 'Paste your text here...'} className="w-full rounded-md border bg-background p-3 text-sm" />
        <div className="flex items-center gap-3">
          <label className="text-sm">{fr ? 'Traduire vers' : 'Translate to'}</label>
          <select value={target} onChange={(e) => setTarget(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
            {LANGS.map((l) => <option key={l.code} value={l.code}>{fr ? l.fr : l.en}</option>)}
          </select>
          <Button onClick={translate} disabled={busy || !text.trim()}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />} {fr ? 'Traduire' : 'Translate'}</Button>
        </div>
        {notConfigured && <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800"><AlertCircle className="h-4 w-4 mt-0.5" /><span>{fr ? 'Service non configuré. Ajoutez la variable DEEPL_API_KEY (clé DeepL) pour activer la traduction.' : 'Service not configured. Add DEEPL_API_KEY (DeepL key) to enable translation.'}</span></div>}
        {out && <div className="space-y-2">
          <div className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">{out}</div>
          <Button variant="outline" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {fr ? 'Copier' : 'Copy'}</Button>
        </div>}
      </CardContent></Card>
    </ToolLayout>
  );
}