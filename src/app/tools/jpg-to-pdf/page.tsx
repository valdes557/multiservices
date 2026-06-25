'use client';
import { useState, useRef } from 'react';
import { FileImage, Upload, Download, Loader2 } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/context/LocaleContext';

export default function JpgToPdfPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setFiles(Array.from(e.target.files));
  }
  async function generate() {
    if (!files.length) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdf = await PDFDocument.create();
      for (const f of files) {
        const bytes = new Uint8Array(await f.arrayBuffer());
        const img = f.type.includes('png') ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const out = await pdf.save();
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'images.pdf'; a.click();
    } catch (err) { alert(fr ? 'Erreur lors de la conversion.' : 'Conversion error.'); }
    setBusy(false);
  }

  return (
    <ToolLayout title={fr ? "JPG en PDF" : "JPG to PDF"} description={fr ? "Convertissez une ou plusieurs images JPG/PNG en un fichier PDF, directement dans votre navigateur." : "Convert one or more JPG/PNG images into a single PDF, right in your browser."} icon={<FileImage className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="image/jpeg,image/png" multiple onChange={onFiles} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir des images (JPG/PNG)' : 'Choose images (JPG/PNG)'}</Button>
        {files.length > 0 && <div className="space-y-1 text-sm text-muted-foreground">{files.map((f, i) => <p key={i}>📄 {f.name}</p>)}</div>}
        <Button onClick={generate} disabled={busy || !files.length}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {fr ? 'Créer le PDF' : 'Create PDF'}</Button>
      </CardContent></Card>
    </ToolLayout>
  );
}