'use client';
import { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

type SchemaType = 'Organization' | 'LocalBusiness' | 'Article' | 'Product' | 'FAQPage';

export default function SchemaGeneratorPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [type, setType] = useState<SchemaType>('Organization');
  const [f, setF] = useState<Record<string, string>>({ name: '', url: '', description: '', image: '' });
  const [copied, setCopied] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  function build() {
    const base: any = { '@context': 'https://schema.org', '@type': type };
    if (f.name) base.name = f.name;
    if (f.url) base.url = f.url;
    if (f.description) base.description = f.description;
    if (f.image) base.image = f.image;
    if (type === 'Product' && f.price) base.offers = { '@type': 'Offer', price: f.price, priceCurrency: f.currency || 'EUR' };
    if (type === 'Article' && f.author) base.author = { '@type': 'Person', name: f.author };
    return JSON.stringify(base, null, 2);
  }
  const out = build();
  const snippet = '<script type="application/ld+json">\n' + out + '\n</script>';
  function copy() { navigator.clipboard.writeText(snippet); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const extra: Record<SchemaType, string[]> = {
    Organization: [], LocalBusiness: [], Article: ['author'], Product: ['price', 'currency'], FAQPage: [],
  };

  return (
    <ToolLayout title={fr ? "Generateur de schemas Schema.org" : "Schema.org Generator"} description={fr ? "Generez des donnees structurees JSON-LD (Article, Product, FAQ, LocalBusiness...) pour le SEO." : "Generate JSON-LD structured data (Article, Product, FAQ, LocalBusiness...) for SEO."} icon={<Code2 className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div><Label>Type</Label>
          <select value={type} onChange={(e) => setType(e.target.value as SchemaType)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
            {['Organization','LocalBusiness','Article','Product','FAQPage'].map((x) => <option key={x} value={x}>{x}</option>)}
          </select></div>
        {['name','url','description','image', ...extra[type]].map((k) => (
          <div key={k}><Label className="capitalize">{k}</Label><Input value={f[k] || ''} onChange={set(k)} /></div>
        ))}
        <Button variant="outline" size="sm" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {fr ? 'Copier le snippet' : 'Copy snippet'}</Button>
        <pre className="overflow-auto rounded-md border bg-muted/40 p-3 text-xs">{snippet}</pre>
      </CardContent></Card>
    </ToolLayout>
  );
}