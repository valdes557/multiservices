'use client';
import { Youtube } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AiToolForm } from '@/components/tools/AiToolForm';
import { useLocale } from '@/context/LocaleContext';

export default function Page() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  return (
    <ToolLayout title={fr ? "Titres YouTube" : "YouTube Titles"} description={fr ? "Générez des titres YouTube accrocheurs et optimisés pour le clic." : "Generate catchy, click-optimized YouTube titles."} icon={<Youtube className="h-6 w-6" />}>
      <Card><CardContent className="p-6">
        <AiToolForm task="youtube" inputLabel={fr ? "Sujet de la vidéo" : "Video topic"} placeholder={fr ? "Ex: tutoriel montage vidéo pour débutants" : "E.g. video editing tutorial for beginners"} fields={[]} />
      </CardContent></Card>
    </ToolLayout>
  );
}