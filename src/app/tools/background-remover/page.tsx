'use client';
import { useState, useRef } from 'react';
import { Eraser, Upload, Download, Loader2, AlertCircle } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/context/LocaleContext';

export default function BackgroundRemoverPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) { const f = e.target.files?.[0]; if (f) { setFile(f); setResult(null); setNotConfigured(false); } }
  async function run() {
    if (!file) return;
    setBusy(true); setNotConfigured(false);
    try {
      const form = new FormData(); form.append('image', file);
      const res = await fetch('/api/background-remover', { method: 'POST', body: form });
      if (res.status === 503) { setNotConfigured(true); setBusy(false); return; }
      if (!res.ok) { alert(fr ? 'Erreur du service.' : 'Service error.'); setBusy(false); return; }
      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
    } catch { alert(fr ? 'Erreur réseau.' : 'Network error.'); }
    setBusy(false);
  }

  return (
    <ToolLayout title={fr ? "Suppression d’arrière-plan" : "Background Remover"} description={fr ? "Supprimez automatiquement l’arrière-plan d’une image (via service remove.bg)." : "Automatically remove an image background (via remove.bg service)."} icon={<Eraser className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir une image' : 'Choose an image'}</Button>
        {file && <p className="text-sm text-muted-foreground">🖼️ {file.name}</p>}
        <Button onClick={run} disabled={busy || !file}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eraser className="h-4 w-4" />} {fr ? 'Supprimer l\'arrière-plan' : 'Remove background'}</Button>
        {notConfigured && <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800"><AlertCircle className="h-4 w-4 mt-0.5" /><span>{fr ? 'Service non configuré. Ajoutez la variable REMOVE_BG_API_KEY (clé remove.bg) pour activer cet outil.' : 'Service not configured. Add REMOVE_BG_API_KEY (remove.bg key) to enable this tool.'}</span></div>}
        {result && <div className="space-y-2">
          <img src={result} alt="result" className="max-w-full rounded-md border" style={{ background: 'repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 50% / 20px 20px' }} />
          <a href={result} download="sans-fond.png"><Button variant="outline"><Download className="h-4 w-4" /> {fr ? 'Télécharger' : 'Download'}</Button></a>
        </div>}
      </CardContent></Card>
    </ToolLayout>
  );
}