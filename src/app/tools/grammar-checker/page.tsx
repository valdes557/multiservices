'use client';
import { SpellCheck } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AiToolForm } from '@/components/tools/AiToolForm';
import { useLocale } from '@/context/LocaleContext';

export default function Page() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  return (
    <ToolLayout title={fr ? "Correcteur grammatical" : "Grammar Checker"} description={fr ? "Corrigez les fautes d’orthographe, de grammaire et de ponctuation." : "Fix spelling, grammar and punctuation mistakes."} icon={<SpellCheck className="h-6 w-6" />}>
      <Card><CardContent className="p-6">
        <AiToolForm task="grammar" inputLabel={fr ? "Texte à corriger" : "Text to fix"} placeholder={fr ? "Collez le texte à corriger…" : "Paste text to check…"} fields={[]} />
      </CardContent></Card>
    </ToolLayout>
  );
}