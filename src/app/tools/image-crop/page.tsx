'use client';
import { useState, useRef } from 'react';
import { Crop, Upload, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function ImageCropPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [src, setSrc] = useState('');
  const [out, setOut] = useState('');
  const [ratio, setRatio] = useState('1:1');
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader(); reader.onload = () => { setSrc(reader.result as string); setOut(''); }; reader.readAsDataURL(f);
  }
  function crop() {
    const img = new window.Image();
    img.onload = () => {
      const [rw, rh] = ratio.split(':').map(Number);
      const target = rw / rh;
      const srcRatio = img.width / img.height;
      let sw = img.width, sh = img.height, sx = 0, sy = 0;
      if (srcRatio > target) { sw = img.height * target; sx = (img.width - sw) / 2; }
      else { sh = img.width / target; sy = (img.height - sh) / 2; }
      const canvas = document.createElement('canvas'); canvas.width = sw; canvas.height = sh;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      setOut(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }
  function download() { const a = document.createElement('a'); a.href = out; a.download = 'cropped.png'; a.click(); }

  return (
    <ToolLayout title={fr ? "Recadrage d’images" : "Image Cropper"} description={fr ? "Recadrez vos images aux dimensions exactes ou aux ratios courants (1:1, 16:9, 4:3)." : "Crop your images to exact dimensions or common ratios (1:1, 16:9, 4:3)."} icon={<Crop className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir une image' : 'Choose image'}</Button>
        {src && <>
          <div><Label>{fr ? 'Ratio' : 'Aspect ratio'}</Label>
            <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="1:1">1:1 ({fr ? 'carré' : 'square'})</option>
              <option value="16:9">16:9</option><option value="4:3">4:3</option><option value="3:4">3:4 ({fr ? 'portrait' : 'portrait'})</option><option value="3:2">3:2</option>
            </select></div>
          <Button onClick={crop}>{fr ? 'Recadrer' : 'Crop'}</Button>
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