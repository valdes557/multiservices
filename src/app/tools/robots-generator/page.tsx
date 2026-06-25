'use client';
import { useState } from 'react';
import { Bot, Copy, Check, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLocale } from '@/context/LocaleContext';

export default function RobotsGeneratorPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [allowAll, setAllowAll] = useState(true);
  const [disallow, setDisallow] = useState('/admin\n/dashboard\n/api');
  const [sitemap, setSitemap] = useState('https://exemple.com/sitemap.xml');
  const [copied, setCopied] = useState(false);

  const lines = ['User-agent: *'];
  if (allowAll) lines.push('Allow: /');
  disallow.split('\n').map((d) => d.trim()).filter(Boolean).forEach((d) => lines.push('Disallow: ' + d));
  if (sitemap.trim()) lines.push('', 'Sitemap: ' + sitemap.trim());
  const out = lines.join('\n');

  function copy() { navigator.clipboard.writeText(out); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  function download() {
    const blob = new Blob([out], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'robots.txt'; a.click();
  }

  return (
    <ToolLayout title={fr ? "Generateur de robots.txt" : "robots.txt Generator"} description={fr ? "Creez un fichier robots.txt optimise pour controler l\u2019exploration des moteurs de recherche." : "Create an optimized robots.txt to control search engine crawling."} icon={<Bot className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={allowAll} onChange={(e) => setAllowAll(e.target.checked)} /> {fr ? 'Autoriser tout le site (Allow: /)' : 'Allow entire site (Allow: /)'}</label>
        <div><Label>{fr ? 'Chemins interdits (un par ligne)' : 'Disallowed paths (one per line)'}</Label>
          <Textarea rows={4} value={disallow} onChange={(e) => setDisallow(e.target.value)} className="font-mono text-sm" /></div>
        <div><Label>{fr ? 'URL du sitemap' : 'Sitemap URL'}</Label>
          <Input value={sitemap} onChange={(e) => setSitemap(e.target.value)} /></div>
        <div className="flex gap-2"><Button variant="outline" size="sm" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {fr ? 'Copier' : 'Copy'}</Button>
          <Button variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> robots.txt</Button></div>
        <pre className="overflow-auto rounded-md border bg-muted/40 p-3 text-xs">{out}</pre>
      </CardContent></Card>
    </ToolLayout>
  );
}