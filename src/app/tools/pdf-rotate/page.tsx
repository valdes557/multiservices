'use client';
import { useState, useRef } from 'react';
import { RotateCw, Upload, Download, Loader2 } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function PdfRotatePage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(90);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) { const f = e.target.files?.[0]; if (f) setFile(f); }
  async function rotate() {
    if (!file) return;
    setBusy(true);
    try {
      const { PDFDocument, degrees } = await import('pdf-lib');
      const doc = await PDFDocument.load(new Uint8Array(await file.arrayBuffer()));
      doc.getPages().forEach((p) => { const cur = p.getRotation().angle; p.setRotation(degrees((cur + angle) % 360)); });
      const bytes = await doc.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pivote.pdf'; a.click();
    } catch { alert(fr ? 'Erreur lors de la rotation.' : 'Rotation error.'); }
    setBusy(false);
  }

  return (
    <ToolLayout title={fr ? "Pivoter un PDF" : "Rotate PDF"} description={fr ? "Faites pivoter toutes les pages d’un PDF de 90, 180 ou 270 degrés." : "Rotate all pages of a PDF by 90, 180 or 270 degrees."} icon={<RotateCw className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="application/pdf" onChange={onFile} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir un PDF' : 'Choose PDF'}</Button>
        {file && <>
          <p className="text-sm text-muted-foreground">📄 {file.name}</p>
          <div><Label>{fr ? 'Angle de rotation' : 'Rotation angle'}</Label>
            <select value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option>
            </select></div>
          <Button onClick={rotate} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {fr ? 'Pivoter' : 'Rotate'}</Button>
        </>}
      </CardContent></Card>
    </ToolLayout>
  );
}