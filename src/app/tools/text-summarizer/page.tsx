'use client';
import { AlignLeft } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AiToolForm } from '@/components/tools/AiToolForm';
import { useLocale } from '@/context/LocaleContext';

export default function Page() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  return (
    <ToolLayout title={fr ? "Résumeur de texte" : "Text Summarizer"} description={fr ? "Résumez automatiquement un texte long en quelques phrases essentielles." : "Automatically summarize long text into key sentences."} icon={<AlignLeft className="h-6 w-6" />}>
      <Card><CardContent className="p-6">
        <AiToolForm task="summarize" inputLabel={fr ? "Texte à résumer" : "Text to summarize"} placeholder={fr ? "Collez votre texte long ici…" : "Paste your long text here…"} fields={[]} />
      </CardContent></Card>
    </ToolLayout>
  );
}