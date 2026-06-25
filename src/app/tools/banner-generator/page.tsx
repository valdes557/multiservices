'use client';
import * as React from 'react';
import { useRef, useState } from 'react';
import { Image as ImageIcon, Download, FileDown } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { PremiumGate } from '@/components/tools/PremiumGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/context/LocaleContext';

const formats = [
  { id: 'facebook', label: 'Facebook', w: 1200, h: 628 },
  { id: 'instagram', label: 'Instagram', w: 1080, h: 1080 },
  { id: 'googleads', label: 'Google Ads', w: 970, h: 250 },
  { id: 'linkedin', label: 'LinkedIn', w: 1200, h: 627 },
  { id: 'youtube', label: 'YouTube', w: 1280, h: 720 },
];

export default function BannerGeneratorPage() {
  const { locale } = useLocale();
  const en = locale === 'en';
  const [fmt, setFmt] = useState(formats[0]);
  const [title, setTitle] = useState(en ? 'Your catchy title' : 'Votre titre accrocheur');
  const [subtitle, setSubtitle] = useState(en ? 'A convincing subtitle for your offer' : 'Un sous-titre convaincant pour votre offre');
  const [cta, setCta] = useState(en ? 'Learn more' : 'En savoir plus');
  const [bg, setBg] = useState('#1e3a8a');
  const [bg2, setBg2] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [ctaColor, setCtaColor] = useState('#f59e0b');
  const [imageUrl, setImageUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onload = () => setter(r.result as string); r.readAsDataURL(file); }
  }

  async function snapshot() {
    const { default: html2canvas } = await import('html2canvas');
    return html2canvas(ref.current!, { scale: 2, useCORS: true, backgroundColor: null });
  }
  async function downloadPng() {
    const canvas = await snapshot();
    const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = `banner-${fmt.id}.png`; a.click();
  }
  async function downloadPdf() {
    const canvas = await snapshot();
    const { default: jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ unit: 'px', format: [fmt.w, fmt.h], orientation: fmt.w >= fmt.h ? 'landscape' : 'portrait' });
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, fmt.w, fmt.h);
    pdf.save(`banner-${fmt.id}.pdf`);
  }

  const scale = Math.min(560 / fmt.w, 400 / fmt.h);

  return (
    <ToolLayout title={en ? 'Ad banner generator' : 'Générateur de bannières publicitaires'} description={en ? 'Create banners for Facebook, Instagram, Google Ads, LinkedIn and YouTube, then export as PNG or PDF.' : 'Créez des bannières pour Facebook, Instagram, Google Ads, LinkedIn et YouTube, puis exportez en PNG ou PDF.'} icon={<ImageIcon className="h-7 w-7" />} premium>
      <PremiumGate toolName={en ? 'Banner generator' : 'Générateur de bannières'}>
      <div className="mb-6 flex flex-wrap gap-2">
        {formats.map((f) => (
          <button key={f.id} onClick={() => setFmt(f)} className={`rounded-full border px-4 py-1.5 text-sm ${fmt.id === f.id ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
            {f.label} <span className="opacity-60">{f.w}×{f.h}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader><CardTitle>{en ? 'Customization' : 'Personnalisation'}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5"><Label>{en ? 'Title' : 'Titre'}</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>{en ? 'Subtitle' : 'Sous-titre'}</Label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>{en ? 'Button text (CTA)' : 'Texte du bouton (CTA)'}</Label><Input value={cta} onChange={(e) => setCta(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <Color label={en ? 'Background 1' : 'Fond 1'} value={bg} onChange={setBg} />
              <Color label={en ? 'Background 2' : 'Fond 2'} value={bg2} onChange={setBg2} />
              <Color label={en ? 'Text' : 'Texte'} value={textColor} onChange={setTextColor} />
              <Color label={en ? 'Button' : 'Bouton'} value={ctaColor} onChange={setCtaColor} />
            </div>
            <div className="space-y-1.5"><Label>{en ? 'Background image' : 'Image de fond'}</Label><Input type="file" accept="image/*" onChange={(e) => onFile(e, setImageUrl)} /></div>
            <div className="space-y-1.5"><Label>{en ? 'Logo' : 'Logo'}</Label><Input type="file" accept="image/*" onChange={(e) => onFile(e, setLogoUrl)} /></div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={downloadPng}><Download className="mr-2 h-4 w-4" /> PNG</Button>
              <Button className="flex-1" variant="outline" onClick={downloadPdf}><FileDown className="mr-2 h-4 w-4" /> PDF</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start justify-center overflow-auto rounded-lg border bg-muted/30 p-4">
          <div style={{ width: fmt.w * scale, height: fmt.h * scale }}>
            <div ref={ref} style={{
              width: fmt.w, height: fmt.h, transform: `scale(${scale})`, transformOrigin: 'top left',
              background: imageUrl ? `linear-gradient(135deg, ${bg}cc, ${bg2}cc), url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${bg}, ${bg2})`,
              color: textColor, display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: 64, position: 'relative', boxSizing: 'border-box',
            }}>
              {logoUrl && <img src={logoUrl} alt="logo" style={{ position: 'absolute', top: 40, right: 40, height: 80, objectFit: 'contain' }} />}
              <h2 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, margin: 0, maxWidth: '80%' }}>{title}</h2>
              <p style={{ fontSize: 32, marginTop: 24, maxWidth: '75%', opacity: 0.95 }}>{subtitle}</p>
              {cta && <span style={{ marginTop: 40, alignSelf: 'flex-start', background: ctaColor, color: '#111', fontSize: 28, fontWeight: 700, padding: '18px 40px', borderRadius: 12 }}>{cta}</span>}
            </div>
          </div>
        </div>
      </div>
      </PremiumGate>
    </ToolLayout>
  );
}

function Color({ label, value, onChange }: { label: string; value: string; onChange: (s: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-9 cursor-pointer rounded border" />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-9 text-xs" />
      </div>
    </div>
  );
}