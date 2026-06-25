'use client';
import Link from 'next/link';
import { tools } from '@/lib/tools';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

export function ToolsGrid() {
  const { locale } = useLocale();
  const en = locale === 'en';
  const header = en
    ? { title: 'All our tools', subtitle: 'Fast, free and professional tools for your daily needs.', open: 'Open' }
    : { title: 'Tous nos outils', subtitle: 'Des outils rapides, gratuits et professionnels pour votre quotidien.', open: 'Ouvrir' };
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">{header.title}</h1>
        <p className="mt-2 text-muted-foreground">{header.subtitle}</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
            <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary"><ToolIcon name={tool.icon} className="h-6 w-6" /></div>
                  {tool.premium && <Badge className="bg-amber-500 hover:bg-amber-500">Premium</Badge>}
                </div>
                <CardTitle className="mt-3 text-lg">{en ? tool.titleEn : tool.titleFr}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{en ? tool.descEn : tool.descFr}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">{header.open} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}