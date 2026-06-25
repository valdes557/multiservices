'use client';
import { useState, useRef } from 'react';
import { FileOutput, Upload, Loader2, AlertCircle } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/context/LocaleContext';

export default function PdfToOfficePage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('docx');
  const [busy, setBusy] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [info, setInfo] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) { const f = e.target.files?.[0]; if (f) { setFile(f); setInfo(''); setNotConfigured(false); } }
  async function convert() {
    if (!file) return;
    setBusy(true); setNotConfigured(false); setInfo('');
    try {
      const form = new FormData(); form.append('file', file); form.append('format', format);
      const res = await fetch('/api/pdf-to-office', { method: 'POST', body: form });
      if (res.status === 503) { setNotConfigured(true); setBusy(false); return; }
      const data = await res.json().catch(() => ({}));
      setInfo(data.hint || (fr ? 'Réponse du service reçue.' : 'Service response received.'));
    } catch { alert(fr ? 'Erreur réseau.' : 'Network error.'); }
    setBusy(false);
  }

  return (
    <ToolLayout title={fr ? "PDF vers Word/Excel" : "PDF to Word/Excel"} description={fr ? "Convertissez un PDF en document Word ou Excel éditable (via service de conversion)." : "Convert a PDF into an editable Word or Excel document (via conversion service)."} icon={<FileOutput className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="application/pdf" onChange={onFile} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir un PDF' : 'Choose a PDF'}</Button>
        {file && <p className="text-sm text-muted-foreground">📄 {file.name}</p>}
        <div className="flex items-center gap-3">
          <label className="text-sm">{fr ? 'Convertir en' : 'Convert to'}</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
            <option value="docx">Word (.docx)</option>
            <option value="xlsx">Excel (.xlsx)</option>
          </select>
          <Button onClick={convert} disabled={busy || !file}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileOutput className="h-4 w-4" />} {fr ? 'Convertir' : 'Convert'}</Button>
        </div>
        {notConfigured && <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800"><AlertCircle className="h-4 w-4 mt-0.5" /><span>{fr ? 'Service non configuré. Ajoutez la variable CLOUDCONVERT_API_KEY pour activer la conversion fidèle.' : 'Service not configured. Add CLOUDCONVERT_API_KEY to enable accurate conversion.'}</span></div>}
        {info && <p className="text-sm text-muted-foreground">{info}</p>}
      </CardContent></Card>
    </ToolLayout>
  );
}