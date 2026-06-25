'use client';
import { useState, useRef } from 'react';
import { Stamp, Upload, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function ImageWatermarkPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [src, setSrc] = useState('');
  const [out, setOut] = useState('');
  const [text, setText] = useState('© MonSite');
  const [opacity, setOpacity] = useState(50);
  const [size, setSize] = useState(5);
  const [pos, setPos] = useState('br');
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader(); reader.onload = () => { setSrc(reader.result as string); setOut(''); }; reader.readAsDataURL(f);
  }
  function apply() {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!; ctx.drawImage(img, 0, 0);
      const fontSize = Math.round(img.width * size / 100);
      ctx.font = 'bold ' + fontSize + 'px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,' + opacity / 100 + ')';
      ctx.strokeStyle = 'rgba(0,0,0,' + opacity / 200 + ')';
      ctx.lineWidth = Math.max(1, fontSize / 20);
      const m = ctx.measureText(text); const pad = fontSize * 0.5;
      let x = pad, y = fontSize + pad;
      if (pos.includes('r')) x = canvas.width - m.width - pad;
      if (pos.includes('b')) y = canvas.height - pad;
      if (pos === 'center') { x = (canvas.width - m.width) / 2; y = canvas.height / 2; }
      ctx.strokeText(text, x, y); ctx.fillText(text, x, y);
      setOut(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }
  function download() { const a = document.createElement('a'); a.href = out; a.download = 'watermarked.png'; a.click(); }

  return (
    <ToolLayout title={fr ? "Filigrane d’images" : "Image Watermark"} description={fr ? "Ajoutez un filigrane texte personnalisable à vos images pour les protéger." : "Add a customizable text watermark to your images to protect them."} icon={<Stamp className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {fr ? 'Choisir une image' : 'Choose image'}</Button>
        {src && <>
          <div><Label>{fr ? 'Texte du filigrane' : 'Watermark text'}</Label><Input value={text} onChange={(e) => setText(e.target.value)} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>{fr ? 'Opacité' : 'Opacity'}: {opacity}%</Label><input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" /></div>
            <div><Label>{fr ? 'Taille' : 'Size'}: {size}%</Label><input type="range" min={2} max={15} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" /></div>
            <div><Label>{fr ? 'Position' : 'Position'}</Label>
              <select value={pos} onChange={(e) => setPos(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="tl">{fr ? 'Haut gauche' : 'Top left'}</option><option value="tr">{fr ? 'Haut droite' : 'Top right'}</option>
                <option value="center">Centre</option>
                <option value="bl">{fr ? 'Bas gauche' : 'Bottom left'}</option><option value="br">{fr ? 'Bas droite' : 'Bottom right'}</option>
              </select></div>
          </div>
          <Button onClick={apply}>{fr ? 'Appliquer' : 'Apply'}</Button>
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