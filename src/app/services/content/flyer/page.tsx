'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutTemplate, Download, FileDown, Image as ImageIcon, Lock, Sparkles, Trash2,
} from 'lucide-react';

/**
 * Professional flyer generator (requirement #5).
 * 100% client-side: edit a live A4 preview, then export to PNG (html2canvas)
 * or PDF (jspdf). Premium tool — gated behind an active trial or paid plan.
 */

type Locale = 'fr' | 'en';

const L: Record<string, Record<Locale, string>> = {
  title: { fr: 'Générateur de flyers professionnels', en: 'Professional Flyer Generator' },
  subtitle: { fr: 'Créez un flyer prêt à imprimer en quelques secondes.', en: 'Create a print-ready flyer in seconds.' },
  template: { fr: 'Modèle', en: 'Template' },
  headline: { fr: 'Titre principal', en: 'Headline' },
  subheadline: { fr: 'Sous-titre', en: 'Subtitle' },
  body: { fr: 'Description', en: 'Description' },
  dateLoc: { fr: 'Date / Lieu', en: 'Date / Location' },
  phone: { fr: 'Téléphone', en: 'Phone' },
  email: { fr: 'Email', en: 'Email' },
  website: { fr: 'Site web', en: 'Website' },
  colors: { fr: 'Couleurs', en: 'Colors' },
  primary: { fr: 'Principale', en: 'Primary' },
  secondary: { fr: 'Secondaire', en: 'Secondary' },
  textColor: { fr: 'Texte', en: 'Text' },
  logo: { fr: 'Logo / Photo', en: 'Logo / Photo' },
  upload: { fr: 'Importer une image', en: 'Upload image' },
  remove: { fr: 'Retirer', en: 'Remove' },
  downloadPng: { fr: 'Télécharger PNG', en: 'Download PNG' },
  downloadPdf: { fr: 'Télécharger PDF', en: 'Download PDF' },
  preview: { fr: 'Aperçu', en: 'Preview' },
  locked: { fr: 'Outil premium', en: 'Premium tool' },
  lockedDesc: {
    fr: "Le générateur de flyers est réservé aux abonnés (essai gratuit ou plan payant).",
    en: 'The flyer generator is reserved for subscribers (free trial or paid plan).',
  },
  seePlans: { fr: 'Voir les plans', en: 'See plans' },
  exporting: { fr: 'Export…', en: 'Exporting…' },
};

interface Template {
  key: string;
  name: Record<Locale, string>;
  primary: string;
  secondary: string;
  text: string;
  align: 'left' | 'center';
}

const TEMPLATES: Template[] = [
  { key: 'event', name: { fr: 'Événement', en: 'Event' }, primary: '#7c3aed', secondary: '#ec4899', text: '#ffffff', align: 'center' },
  { key: 'business', name: { fr: 'Business', en: 'Business' }, primary: '#0f172a', secondary: '#2563eb', text: '#ffffff', align: 'left' },
  { key: 'promo', name: { fr: 'Promo', en: 'Sale' }, primary: '#dc2626', secondary: '#f59e0b', text: '#ffffff', align: 'center' },
  { key: 'resto', name: { fr: 'Restaurant', en: 'Restaurant' }, primary: '#065f46', secondary: '#84cc16', text: '#ffffff', align: 'center' },
  { key: 'minimal', name: { fr: 'Minimaliste', en: 'Minimal' }, primary: '#f8fafc', secondary: '#1e293b', text: '#0f172a', align: 'left' },
];

export default function FlyerPage() {
  const { locale } = useLocale();
  const lc = (locale === 'en' ? 'en' : 'fr') as Locale;
  const tr = (k: string) => L[k]?.[lc] ?? k;
  const { hasPremiumAccess } = useAuth();
  const allowed = hasPremiumAccess();

  const flyerRef = useRef<HTMLDivElement>(null);
  const [tpl, setTpl] = useState<Template>(TEMPLATES[0]);
  const [primary, setPrimary] = useState(TEMPLATES[0].primary);
  const [secondary, setSecondary] = useState(TEMPLATES[0].secondary);
  const [text, setText] = useState(TEMPLATES[0].text);
  const [align, setAlign] = useState<'left' | 'center'>(TEMPLATES[0].align);
  const [image, setImage] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const [data, setData] = useState({
    headline: lc === 'fr' ? 'Votre titre ici' : 'Your headline here',
    subheadline: lc === 'fr' ? 'Un sous-titre accrocheur' : 'A catchy subtitle',
    body: lc === 'fr'
      ? 'Décrivez votre événement, offre ou service en quelques lignes percutantes.'
      : 'Describe your event, offer or service in a few punchy lines.',
    dateLoc: lc === 'fr' ? '25 Déc. 2026 · Cotonou' : 'Dec 25, 2026 · Cotonou',
    phone: '+229 00 00 00 00',
    email: 'contact@exemple.com',
    website: 'www.exemple.com',
  });
  const set = (k: keyof typeof data, v: string) => setData((d) => ({ ...d, [k]: v }));

  const applyTemplate = (t: Template) => {
    setTpl(t); setPrimary(t.primary); setSecondary(t.secondary); setText(t.text); setAlign(t.align);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const exportPng = async () => {
    if (!flyerRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(flyerRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = 'flyer.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setExporting(false);
    }
  };

  const exportPdf = async () => {
    if (!flyerRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(flyerRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(img, 'PNG', 0, 0, 210, 297);
      pdf.save('flyer.pdf');
    } finally {
      setExporting(false);
    }
  };

  if (!allowed) {
    return (
      <div className="py-16">
        <div className="container max-w-lg">
          <Card className="text-center p-8">
            <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="mb-2">{tr('locked')}</CardTitle>
            <p className="text-muted-foreground mb-6">{tr('lockedDesc')}</p>
            <Link href="/pricing"><Button>{tr('seePlans')}</Button></Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600">
            <LayoutTemplate className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">{tr('title')} <Badge variant="secondary">Premium</Badge></h1>
            <p className="text-muted-foreground">{tr('subtitle')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_440px] gap-6">
          {/* ---- Editor ---- */}
          <div className="space-y-4 order-2 lg:order-1">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">{tr('template')}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((t) => (
                    <Button key={t.key} size="sm" variant={tpl.key === t.key ? 'default' : 'outline'} onClick={() => applyTemplate(t)}>
                      {t.name[lc]}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4" /> {tr('headline')}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1"><Label>{tr('headline')}</Label><Input value={data.headline} onChange={(e) => set('headline', e.target.value)} /></div>
                <div className="space-y-1"><Label>{tr('subheadline')}</Label><Input value={data.subheadline} onChange={(e) => set('subheadline', e.target.value)} /></div>
                <div className="space-y-1"><Label>{tr('body')}</Label><Textarea value={data.body} onChange={(e) => set('body', e.target.value)} className="min-h-[80px]" /></div>
                <div className="space-y-1"><Label>{tr('dateLoc')}</Label><Input value={data.dateLoc} onChange={(e) => set('dateLoc', e.target.value)} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1"><Label>{tr('phone')}</Label><Input value={data.phone} onChange={(e) => set('phone', e.target.value)} /></div>
                  <div className="space-y-1"><Label>{tr('email')}</Label><Input value={data.email} onChange={(e) => set('email', e.target.value)} /></div>
                  <div className="space-y-1"><Label>{tr('website')}</Label><Input value={data.website} onChange={(e) => set('website', e.target.value)} /></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">{tr('colors')}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="space-y-1"><Label className="text-xs">{tr('primary')}</Label><input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="h-9 w-14 rounded border cursor-pointer" /></div>
                  <div className="space-y-1"><Label className="text-xs">{tr('secondary')}</Label><input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="h-9 w-14 rounded border cursor-pointer" /></div>
                  <div className="space-y-1"><Label className="text-xs">{tr('textColor')}</Label><input type="color" value={text} onChange={(e) => setText(e.target.value)} className="h-9 w-14 rounded border cursor-pointer" /></div>
                  <div className="space-y-1">
                    <Label className="text-xs">Alignement</Label>
                    <div className="flex gap-1">
                      <Button size="sm" variant={align === 'left' ? 'default' : 'outline'} onClick={() => setAlign('left')}>⬅</Button>
                      <Button size="sm" variant={align === 'center' ? 'default' : 'outline'} onClick={() => setAlign('center')}>↔</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ImageIcon className="h-4 w-4" /> {tr('logo')}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-sm hover:bg-muted">
                    <ImageIcon className="h-4 w-4" /> {tr('upload')}
                    <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                  </label>
                  {image && <Button size="sm" variant="ghost" className="text-red-600" onClick={() => setImage(null)}><Trash2 className="h-4 w-4 mr-1" /> {tr('remove')}</Button>}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={exportPng} disabled={exporting}><Download className="h-4 w-4 mr-2" /> {exporting ? tr('exporting') : tr('downloadPng')}</Button>
              <Button variant="outline" onClick={exportPdf} disabled={exporting}><FileDown className="h-4 w-4 mr-2" /> {exporting ? tr('exporting') : tr('downloadPdf')}</Button>
            </div>
          </div>

          {/* ---- Live preview (A4 portrait) ---- */}
          <div className="order-1 lg:order-2">
            <p className="text-sm text-muted-foreground mb-2">{tr('preview')}</p>
            <div className="rounded-xl border shadow-lg overflow-hidden" style={{ aspectRatio: '210 / 297' }}>
              <div
                ref={flyerRef}
                style={{
                  width: '100%', height: '100%', position: 'relative',
                  background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
                  color: text,
                  display: 'flex', flexDirection: 'column',
                  padding: '32px',
                  textAlign: align,
                  alignItems: align === 'center' ? 'center' : 'flex-start',
                  justifyContent: 'space-between',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                <div style={{ width: '100%' }}>
                  {image && (
                    <img src={image} alt="" style={{ maxHeight: 90, maxWidth: '60%', objectFit: 'contain', marginBottom: 16, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0, display: 'block' }} />
                  )}
                  <h2 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1, margin: 0, letterSpacing: '-0.5px' }}>{data.headline}</h2>
                  <p style={{ fontSize: 18, fontWeight: 600, opacity: 0.95, margin: '8px 0 0' }}>{data.subheadline}</p>
                </div>

                <div style={{ width: '100%' }}>
                  <div style={{ height: 3, width: 64, background: text, opacity: 0.5, margin: align === 'center' ? '0 auto 14px' : '0 0 14px' }} />
                  <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, opacity: 0.95 }}>{data.body}</p>
                  {data.dateLoc && <p style={{ fontSize: 15, fontWeight: 700, marginTop: 14 }}>📅 {data.dateLoc}</p>}
                </div>

                <div style={{ width: '100%', fontSize: 12, opacity: 0.95, lineHeight: 1.6 }}>
                  {data.phone && <div>📞 {data.phone}</div>}
                  {data.email && <div>✉️ {data.email}</div>}
                  {data.website && <div>🌐 {data.website}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
