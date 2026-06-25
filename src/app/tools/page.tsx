import { buildMetadata } from '@/lib/seo';
import { ToolsGrid } from '@/components/tools/ToolsGrid';

export const metadata = buildMetadata({
  title: 'Outils gratuits en ligne — MultiServices',
  description: 'Convertisseur de devises, calculateur de prêt, générateur de CV, documents administratifs, bannières et plus. Tous vos outils en un seul endroit.',
  path: '/tools',
  keywords: ['outils en ligne','convertisseur','calculateur','générateur cv','documents','bannières'],
});

export default function ToolsPage() {
  return <ToolsGrid />;
}