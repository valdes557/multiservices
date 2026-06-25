'use client';
import { useState, useRef } from 'react';
import { Scissors, Upload, Download, Loader2 } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function PdfSplitPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f);
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.load(new Uint8Array(await f.arrayBuffer()));
    setPageCount(doc.getPageCount()); setFrom(1); setTo(doc.getPageCount());
  }
  async function split() {
    if (!file) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const src = await PDFDocument.load(new Uint8Array(await file.arrayBuffer()));
      const out = await PDFDocument.create();
      const start = Math.max(1, from) - 1, end = Math.min(pageCount, to);
      const indices = [];
      for (let i = start; i < end; i++) indices.push(i);
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'extrait.pdf'; a.click();
    } catch { alert(fr ? 'Erreur lors du découpage.' : 'Split error.'); }
    setBusy(false);
  }

  return (
    <ToolLayout title={fr ? "Découper un PDF" : "Split PDF"} description={fr ? "Extrayez une plage de pages d’un PDF dans un nouveau fichier." : "Extract a range of pages from a PDF into a new file."} icon={<Scissors className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="application/pdf" onChange={onFile} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir un PDF' : 'Choose PDF'}</Button>
        {pageCount > 0 && <>
          <p className="text-sm text-muted-foreground">{fr ? 'Total : ' : 'Total: '}{pageCount} {fr ? 'pages' : 'pages'}</p>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>{fr ? 'De la page' : 'From page'}</Label><Input type="number" min={1} max={pageCount} value={from} onChange={(e) => setFrom(Number(e.target.value))} /></div>
            <div><Label>{fr ? 'À la page' : 'To page'}</Label><Input type="number" min={1} max={pageCount} value={to} onChange={(e) => setTo(Number(e.target.value))} /></div>
          </div>
          <Button onClick={split} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {fr ? 'Extraire' : 'Extract'}</Button>
        </>}
      </CardContent></Card>
    </ToolLayout>
  );
}