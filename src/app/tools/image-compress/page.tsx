'use client';
import { useState, useRef } from 'react';
import { FileImage, Upload, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function ImageCompressPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [src, setSrc] = useState('');
  const [out, setOut] = useState('');
  const [quality, setQuality] = useState(70);
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setOrigSize(f.size);
    const reader = new FileReader();
    reader.onload = () => { setSrc(reader.result as string); setOut(''); };
    reader.readAsDataURL(f);
  }
  function compress() {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!; ctx.drawImage(img, 0, 0);
      const data = canvas.toDataURL('image/jpeg', quality / 100);
      setOut(data);
      setNewSize(Math.round((data.length - 'data:image/jpeg;base64,'.length) * 0.75));
    };
    img.src = src;
  }
  function download() { const a = document.createElement('a'); a.href = out; a.download = 'compressed.jpg'; a.click(); }
  const kb = (b: number) => (b / 1024).toFixed(0) + ' Ko';
  const saved = origSize && newSize ? Math.round((1 - newSize / origSize) * 100) : 0;

  return (
    <ToolLayout title={fr ? "Compresseur d’images" : "Image Compressor"} description={fr ? "Réduisez le poids de vos images JPG/PNG/WEBP directement dans le navigateur, sans perte de confidentialité." : "Reduce the size of your JPG/PNG/WEBP images right in your browser, fully private."} icon={<FileImage className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir une image' : 'Choose image'}</Button>
        {src && <>
          <div><Label>{fr ? 'Qualité' : 'Quality'}: {quality}%</Label>
            <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" /></div>
          <Button onClick={compress}>{fr ? 'Compresser' : 'Compress'}</Button>
        </>}
        {out && <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={out} alt="result" className="max-h-64 rounded-md border" />
          <p className="text-sm text-muted-foreground">{kb(origSize)} → <span className="font-semibold text-green-600">{kb(newSize)}</span> ({saved > 0 ? '-' + saved + '%' : '—'})</p>
          <Button variant="outline" onClick={download}><Download className="h-4 w-4" /> {fr ? 'Télécharger' : 'Download'}</Button>
        </div>}
      </CardContent></Card>
    </ToolLayout>
  );
}