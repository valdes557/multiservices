'use client';
import { useState } from 'react';
import { QrCode, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function QrCodePage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [text, setText] = useState('https://exemple.com');
  const [size, setSize] = useState(300);
  const [fg, setFg] = useState('000000');
  const [bg, setBg] = useState('ffffff');

  const src = 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size +
    '&data=' + encodeURIComponent(text) + '&color=' + fg + '&bgcolor=' + bg;

  async function download() {
    const res = await fetch(src); const blob = await res.blob();
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'qrcode.png'; a.click();
  }

  return (
    <ToolLayout title={fr ? "Generateur de QR Code" : "QR Code Generator"} description={fr ? "Creez des QR codes personnalisables (URL, texte, contact) et telechargez-les en PNG." : "Create customizable QR codes (URL, text, contact) and download them as PNG."} icon={<QrCode className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div><Label>{fr ? 'Texte ou URL' : 'Text or URL'}</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} /></div>
        <div className="grid grid-cols-3 gap-3">
          <div><Label>{fr ? 'Taille' : 'Size'}</Label>
            <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              {[150,300,500,800].map((s) => <option key={s} value={s}>{s}px</option>)}
            </select></div>
          <div><Label>{fr ? 'Couleur' : 'Color'}</Label><Input type="color" value={'#' + fg} onChange={(e) => setFg(e.target.value.slice(1))} /></div>
          <div><Label>Fond</Label><Input type="color" value={'#' + bg} onChange={(e) => setBg(e.target.value.slice(1))} /></div>
        </div>
        {text && <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="QR code" className="rounded-md border" width={size} height={size} />
          <Button variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> PNG</Button>
        </div>}
      </CardContent></Card>
    </ToolLayout>
  );
}