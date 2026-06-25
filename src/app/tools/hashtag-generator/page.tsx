'use client';
import { Hash } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AiToolForm } from '@/components/tools/AiToolForm';
import { useLocale } from '@/context/LocaleContext';

export default function Page() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  return (
    <ToolLayout title={fr ? "Générateur de hashtags" : "Hashtag Generator"} description={fr ? "Trouvez les hashtags les plus pertinents pour booster votre visibilité." : "Find the most relevant hashtags to boost your visibility."} icon={<Hash className="h-6 w-6" />}>
      <Card><CardContent className="p-6">
        <AiToolForm task="hashtags" inputLabel={fr ? "Sujet / description" : "Topic / description"} placeholder={fr ? "Ex: photographie de voyage, plage, coucher de soleil" : "E.g. travel photography, beach, sunset"} fields={[]} />
      </CardContent></Card>
    </ToolLayout>
  );
}