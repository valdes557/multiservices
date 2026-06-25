'use client';
import { Repeat } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AiToolForm } from '@/components/tools/AiToolForm';
import { useLocale } from '@/context/LocaleContext';

export default function Page() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  return (
    <ToolLayout title={fr ? "Reformulateur de texte" : "Text Rephraser"} description={fr ? "Reformulez vos textes pour les rendre plus fluides et professionnels." : "Rephrase your text to make it smoother and more professional."} icon={<Repeat className="h-6 w-6" />}>
      <Card><CardContent className="p-6">
        <AiToolForm task="rephrase" inputLabel={fr ? "Texte à reformuler" : "Text to rephrase"} placeholder={fr ? "Collez le texte à reformuler…" : "Paste text to rephrase…"} fields={[]} />
      </CardContent></Card>
    </ToolLayout>
  );
}