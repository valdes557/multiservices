import Link from 'next/link';
import { tools } from '@/lib/tools';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buildMetadata } from '@/lib/seo';
import { ArrowRight } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Outils gratuits en ligne — MultiServices',
  description: 'Convertisseur de devises, calculateur de prêt, générateur de CV, documents administratifs, bannières et plus. Tous vos outils en un seul endroit.',
  path: '/tools',
  keywords: ['outils en ligne','convertisseur','calculateur','générateur cv','documents','bannières'],
});

export default function ToolsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Tous nos outils</h1>
        <p className="mt-2 text-muted-foreground">Des outils rapides, gratuits et professionnels pour votre quotidien.</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="group">
            <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary"><ToolIcon name={t.icon} className="h-6 w-6" /></div>
                  {t.premium && <Badge className="bg-amber-500 hover:bg-amber-500">Premium</Badge>}
                </div>
                <CardTitle className="mt-3 text-lg">{t.titleFr}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.descFr}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Ouvrir <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}