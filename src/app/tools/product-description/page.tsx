'use client';
import { Package } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AiToolForm } from '@/components/tools/AiToolForm';
import { useLocale } from '@/context/LocaleContext';

export default function Page() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  return (
    <ToolLayout title={fr ? "Descriptions produits" : "Product Descriptions"} description={fr ? "Générez des descriptions produits vendeuses pour vos boutiques en ligne." : "Generate compelling product descriptions for your online stores."} icon={<Package className="h-6 w-6" />}>
      <Card><CardContent className="p-6">
        <AiToolForm task="product" inputLabel={fr ? "Caractéristiques du produit" : "Product features"} placeholder={fr ? "Ex: montre connectée, étanche, autonomie 7 jours, écran AMOLED" : "E.g. smartwatch, waterproof, 7-day battery, AMOLED screen"} fields={[{ key: 'name', label: fr ? 'Nom du produit' : 'Product name', placeholder: fr ? 'Nom du produit' : 'Product name' }]} />
      </CardContent></Card>
    </ToolLayout>
  );
}