'use client';
import { useState, useRef } from 'react';
import { RefreshCw, Upload, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function ImageConvertPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [src, setSrc] = useState('');
  const [out, setOut] = useState('');
  const [format, setFormat] = useState('image/png');
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader(); reader.onload = () => { setSrc(reader.result as string); setOut(''); }; reader.readAsDataURL(f);
  }
  function convert() {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      if (format === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0);
      setOut(canvas.toDataURL(format, 0.92));
    };
    img.src = src;
  }
  function download() { const ext = format.split('/')[1].replace('jpeg', 'jpg'); const a = document.createElement('a'); a.href = out; a.download = 'image.' + ext; a.click(); }

  return (
    <ToolLayout title={fr ? "Convertisseur d’images" : "Image Converter"} description={fr ? "Convertissez vos images entre les formats JPG, PNG et WEBP en un clic." : "Convert your images between JPG, PNG and WEBP formats in one click."} icon={<RefreshCw className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir une image' : 'Choose image'}</Button>
        {src && <>
          <div><Label>{fr ? 'Format de sortie' : 'Output format'}</Label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WEBP</option>
            </select></div>
          <Button onClick={convert}>{fr ? 'Convertir' : 'Convert'}</Button>
        </>}
        {out && <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={out} alt="result" className="max-h-64 rounded-md border" />
          <Button variant="outline" onClick={download}><Download className="h-4 w-4" /> {fr ? 'Télécharger' : 'Download'}</Button>
        </div>}
      </CardContent></Card>
    </ToolLayout>
  );
}