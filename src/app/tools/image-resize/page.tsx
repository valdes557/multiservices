'use client';
import { useState, useRef } from 'react';
import { Maximize2, Upload, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function ImageResizePage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [src, setSrc] = useState('');
  const [out, setOut] = useState('');
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [lock, setLock] = useState(true);
  const ratio = useRef(1);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => { ratio.current = img.width / img.height; setW(img.width); setH(img.height); };
      img.src = reader.result as string;
      setSrc(reader.result as string); setOut('');
    };
    reader.readAsDataURL(f);
  }
  function setWidth(v: number) { setW(v); if (lock) setH(Math.round(v / ratio.current)); }
  function setHeight(v: number) { setH(v); if (lock) setW(Math.round(v * ratio.current)); }
  function resize() {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d')!; ctx.drawImage(img, 0, 0, w, h);
      setOut(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }
  function download() { const a = document.createElement('a'); a.href = out; a.download = 'resized.png'; a.click(); }

  return (
    <ToolLayout title={fr ? "Redimensionneur d’images" : "Image Resizer"} description={fr ? "Redimensionnez vos images à la taille souhaitée en conservant les proportions." : "Resize your images to the desired dimensions while keeping aspect ratio."} icon={<Maximize2 className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir une image' : 'Choose image'}</Button>
        {src && <>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>{fr ? 'Largeur (px)' : 'Width (px)'}</Label><Input type="number" value={w} onChange={(e) => setWidth(Number(e.target.value))} /></div>
            <div><Label>{fr ? 'Hauteur (px)' : 'Height (px)'}</Label><Input type="number" value={h} onChange={(e) => setHeight(Number(e.target.value))} /></div>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> {fr ? 'Conserver les proportions' : 'Lock aspect ratio'}</label>
          <Button onClick={resize}>{fr ? 'Redimensionner' : 'Resize'}</Button>
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