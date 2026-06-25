export interface ToolMeta {
  slug: string;
  icon: string; // nom d'icône lucide
  titleFr: string; titleEn: string;
  descFr: string; descEn: string;
  keywords: string[];
  premium?: boolean;
}

export const tools: ToolMeta[] = [
  { slug: 'currency-converter', icon: 'Coins',
    titleFr: 'Convertisseur de devises', titleEn: 'Currency Converter',
    descFr: 'Convertissez toutes les devises mondiales en temps réel avec historique des taux.',
    descEn: 'Convert all world currencies in real time with rate history.',
    keywords: ['convertisseur devises','taux de change','currency converter','exchange rate'] },
  { slug: 'document-generator', icon: 'FileText',
    titleFr: 'Générateur de documents administratifs', titleEn: 'Administrative Document Generator',
    descFr: 'Générez lettres, attestations, factures, devis et contrats puis exportez en PDF.',
    descEn: 'Generate letters, certificates, invoices, quotes and contracts then export to PDF.',
    keywords: ['lettre de motivation','attestation','facture','devis','contrat','modèle document'] },
  { slug: 'text-corrector', icon: 'SpellCheck',
    titleFr: 'Correction & reformulation de texte', titleEn: 'Text Correction & Rewriting',
    descFr: 'Corrigez l\'orthographe, la grammaire et reformulez vos textes (formel, persuasif, simplifié).',
    descEn: 'Fix spelling, grammar and rewrite your text (formal, persuasive, simplified).',
    keywords: ['correction orthographe','grammaire','reformulation','rewriting'] },
  { slug: 'loan-calculator', icon: 'Landmark',
    titleFr: 'Calculateur de prêt', titleEn: 'Loan Calculator',
    descFr: 'Calculez mensualités, intérêts, coût total et tableau d\'amortissement avec graphiques.',
    descEn: 'Compute monthly payments, interest, total cost and amortization schedule with charts.',
    keywords: ['calcul prêt','mensualité','amortissement','simulation crédit','loan calculator'] },
  { slug: 'unit-converter', icon: 'Ruler',
    titleFr: 'Convertisseur universel', titleEn: 'Universal Converter',
    descFr: 'Convertissez distance, poids, température, volume, vitesse, énergie, stockage et plus.',
    descEn: 'Convert distance, weight, temperature, volume, speed, energy, storage and more.',
    keywords: ['convertisseur unités','température','poids','distance','unit converter'] },
  { slug: 'adsense-calculator', icon: 'TrendingUp',
    titleFr: 'Vérificateur de rentabilité AdSense', titleEn: 'AdSense Revenue Estimator',
    descFr: 'Estimez vos revenus AdSense quotidiens, mensuels et annuels selon trafic, CTR et CPC.',
    descEn: 'Estimate daily, monthly and yearly AdSense revenue from traffic, CTR and CPC.',
    keywords: ['adsense','revenus','cpc','ctr','rpm','monetisation'] },
  { slug: 'cv-generator', icon: 'IdCard',
    titleFr: 'Générateur de CV professionnels', titleEn: 'Professional CV Generator',
    descFr: 'Créez un CV moderne et ATS-friendly avec aperçu en temps réel et export PDF.',
    descEn: 'Create a modern, ATS-friendly resume with live preview and PDF export.',
    keywords: ['cv','curriculum vitae','resume','ats','modèle cv'], premium: true },
  { slug: 'banner-generator', icon: 'Image',
    titleFr: 'Générateur de bannières publicitaires', titleEn: 'Ad Banner Generator',
    descFr: 'Créez des bannières Facebook, Instagram, Google Ads, LinkedIn, YouTube (PNG/PDF).',
    descEn: 'Create Facebook, Instagram, Google Ads, LinkedIn, YouTube banners (PNG/PDF).',
    keywords: ['bannière','publicité','ad banner','facebook','instagram','google ads'], premium: true },
];

export const getTool = (slug: string) => tools.find(t => t.slug === slug);
