'use client';
import { useState, useRef } from 'react';
import { Combine, Upload, Download, Loader2 } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/context/LocaleContext';

export default function PdfMergePage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) { if (e.target.files) setFiles(Array.from(e.target.files)); }
  async function merge() {
    if (files.length < 2) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const out = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(new Uint8Array(await f.arrayBuffer()));
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'fusion.pdf'; a.click();
    } catch { alert(fr ? 'Erreur lors de la fusion.' : 'Merge error.'); }
    setBusy(false);
  }

  return (
    <ToolLayout title={fr ? "Fusionner des PDF" : "Merge PDF"} description={fr ? "Combinez plusieurs fichiers PDF en un seul document, sans envoi sur un serveur." : "Combine multiple PDF files into a single document, with no server upload."} icon={<Combine className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="application/pdf" multiple onChange={onFiles} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir des PDF (2 minimum)' : 'Choose PDFs (2 minimum)'}</Button>
        {files.length > 0 && <div className="space-y-1 text-sm text-muted-foreground">{files.map((f, i) => <p key={i}>📄 {i + 1}. {f.name}</p>)}</div>}
        <Button onClick={merge} disabled={busy || files.length < 2}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {fr ? 'Fusionner' : 'Merge'}</Button>
      </CardContent></Card>
    </ToolLayout>
  );
}