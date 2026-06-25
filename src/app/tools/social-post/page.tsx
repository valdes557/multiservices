'use client';
import { Share2 } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AiToolForm } from '@/components/tools/AiToolForm';
import { useLocale } from '@/context/LocaleContext';

export default function Page() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  return (
    <ToolLayout title={fr ? "Posts réseaux sociaux" : "Social Media Posts"} description={fr ? "Créez des publications engageantes avec hashtags pour vos réseaux." : "Create engaging posts with hashtags for your social networks."} icon={<Share2 className="h-6 w-6" />}>
      <Card><CardContent className="p-6">
        <AiToolForm task="social" inputLabel={fr ? "Sujet du post" : "Post topic"} placeholder={fr ? "Ex: lancement de notre nouvelle collection été" : "E.g. launch of our new summer collection"} fields={[]} />
      </CardContent></Card>
    </ToolLayout>
  );
}