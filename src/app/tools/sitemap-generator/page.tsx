'use client';
import { useState } from 'react';
import { Map, Copy, Check, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function SitemapGeneratorPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [urls, setUrls] = useState('https://exemple.com/\nhttps://exemple.com/blog');
  const [freq, setFreq] = useState('weekly');
  const [out, setOut] = useState('');
  const [copied, setCopied] = useState(false);

  function generate() {
    const today = new Date().toISOString().split('T')[0];
    const list = urls.split('\n').map((u) => u.trim()).filter(Boolean);
    const body = list.map((u) => '  <url>\n    <loc>' + u.replace(/&/g, '&amp;') + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>' + freq + '</changefreq>\n  </url>').join('\n');
    setOut('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '\n</urlset>');
  }
  function copy() { navigator.clipboard.writeText(out); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  function download() {
    const blob = new Blob([out], { type: 'application/xml' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sitemap.xml'; a.click();
  }

  return (
    <ToolLayout title={fr ? "Generateur de sitemap XML" : "XML Sitemap Generator"} description={fr ? "Generez un sitemap.xml valide a partir de vos URLs, pret pour Google Search Console." : "Generate a valid sitemap.xml from your URLs, ready for Google Search Console."} icon={<Map className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div><Label>{fr ? 'URLs (une par ligne)' : 'URLs (one per line)'}</Label>
          <Textarea rows={6} value={urls} onChange={(e) => setUrls(e.target.value)} className="font-mono text-sm" /></div>
        <div><Label>{fr ? 'Fréquence' : 'Frequency'}</Label>
          <select value={freq} onChange={(e) => setFreq(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
            {['always','hourly','daily','weekly','monthly','yearly','never'].map((f) => <option key={f} value={f}>{f}</option>)}
          </select></div>
        <Button onClick={generate}>{fr ? 'Générer' : 'Generate'}</Button>
        {out && <div className="space-y-2">
          <div className="flex gap-2"><Button variant="outline" size="sm" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {fr ? 'Copier' : 'Copy'}</Button>
            <Button variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> sitemap.xml</Button></div>
          <pre className="overflow-auto rounded-md border bg-muted/40 p-3 text-xs">{out}</pre>
        </div>}
      </CardContent></Card>
    </ToolLayout>
  );
}