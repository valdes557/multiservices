'use client';
import { Mail } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AiToolForm } from '@/components/tools/AiToolForm';
import { useLocale } from '@/context/LocaleContext';

export default function Page() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  return (
    <ToolLayout title={fr ? "Générateur d’e-mails" : "Email Generator"} description={fr ? "Rédigez des e-mails professionnels à partir de quelques mots-clés." : "Write professional emails from a few keywords."} icon={<Mail className="h-6 w-6" />}>
      <Card><CardContent className="p-6">
        <AiToolForm task="email" inputLabel={fr ? "Objet / points clés" : "Subject / key points"} placeholder={fr ? "Ex: relance facture impayée, ton ferme mais courtois" : "E.g. payment reminder, firm but polite tone"} fields={[{ key: 'subject', label: fr ? 'Sujet' : 'Subject', placeholder: fr ? 'Objet de l\u2019e-mail' : 'Email subject' }, { key: 'tone', label: fr ? 'Ton (professionnel/amical)' : 'Tone (professional/friendly)', placeholder: 'professionnel' }]} />
      </CardContent></Card>
    </ToolLayout>
  );
}