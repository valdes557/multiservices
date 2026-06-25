'use client';
import { useState, useRef } from 'react';
import { Stamp, Upload, Download, Loader2 } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function PdfWatermarkPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIEL');
  const [opacity, setOpacity] = useState(30);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) { const f = e.target.files?.[0]; if (f) setFile(f); }
  async function apply() {
    if (!file) return;
    setBusy(true);
    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import('pdf-lib');
      const doc = await PDFDocument.load(new Uint8Array(await file.arrayBuffer()));
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      doc.getPages().forEach((p) => {
        const { width, height } = p.getSize();
        const size = Math.min(width, height) / 12;
        const tw = font.widthOfTextAtSize(text, size);
        p.drawText(text, {
          x: width / 2 - tw / 2, y: height / 2,
          size, font, color: rgb(0.5, 0.5, 0.5),
          opacity: opacity / 100, rotate: degrees(45),
        });
      });
      const bytes = await doc.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'filigrane.pdf'; a.click();
    } catch { alert(fr ? 'Erreur lors de l\'ajout du filigrane.' : 'Watermark error.'); }
    setBusy(false);
  }

  return (
    <ToolLayout title={fr ? "Filigrane PDF" : "PDF Watermark"} description={fr ? "Ajoutez un filigrane texte sur toutes les pages d’un PDF pour le protéger." : "Add a text watermark on every page of a PDF to protect it."} icon={<Stamp className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="application/pdf" onChange={onFile} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir un PDF' : 'Choose PDF'}</Button>
        {file && <>
          <p className="text-sm text-muted-foreground">📄 {file.name}</p>
          <div><Label>{fr ? 'Texte du filigrane' : 'Watermark text'}</Label><Input value={text} onChange={(e) => setText(e.target.value)} /></div>
          <div><Label>{fr ? 'Opacité' : 'Opacity'}: {opacity}%</Label><input type="range" min={10} max={80} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" /></div>
          <Button onClick={apply} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {fr ? 'Appliquer le filigrane' : 'Apply watermark'}</Button>
        </>}
      </CardContent></Card>
    </ToolLayout>
  );
}