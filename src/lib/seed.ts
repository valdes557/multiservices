import Plan from '@/models/Plan';
import Tool from '@/models/Tool';

/**
 * Default data seeded on first run. Everything here is editable by the admin
 * afterward (plans CRUD, tool↔plan assignment). Re-running only inserts what is
 * missing — it never overwrites admin edits.
 */

export const DEFAULT_PLANS = [
  {
    key: 'gratuit',
    name: { fr: 'Plan Gratuit', en: 'Free Plan' },
    description: {
      fr: 'Gratuit, financé par la publicité : accès aux outils de base avec une pub après chaque action.',
      en: 'Free, ad-supported: access to the basic tools with an ad after each action.',
    },
    price: 0,
    currency: 'XOF',
    trialDays: 0,
    features: [
      { fr: 'Outils de base (PDF, conversions simples)', en: 'Basic tools (PDF, simple conversions)' },
      { fr: 'Publicité après chaque action', en: 'Ad after each action' },
      { fr: 'Forum du plan Gratuit', en: 'Free plan forum' },
    ],
    limits: { toolsPerDay: 10 },
    adsDuringTrial: true,
    showAds: true,
    forumEnabled: true,
    // Activatable by the admin ONLY once AdSense is approved (the plan relies on ads).
    active: false,
    order: 0,
    isSystem: true,
  },
  {
    key: 'eleve',
    name: { fr: 'Plan Élève', en: 'Pupil Plan' },
    description: {
      fr: 'Pour les élèves : les outils essentiels avec 3 jours d’essai gratuit.',
      en: 'For pupils: the essential tools with a 3-day free trial.',
    },
    price: 1000,
    currency: 'XOF',
    trialDays: 3,
    features: [
      { fr: 'Outils essentiels (documents, conversion)', en: 'Essential tools (documents, conversion)' },
      { fr: '3 jours d’essai gratuit', en: '3-day free trial' },
      { fr: 'Forum du plan Élève', en: 'Pupil plan forum' },
    ],
    limits: { toolsPerDay: 20 },
    adsDuringTrial: true,
    showAds: true,
    forumEnabled: true,
    active: true,
    order: 1,
    isSystem: true,
  },
  {
    key: 'etudiant',
    name: { fr: 'Plan Étudiant', en: 'Student Plan' },
    description: {
      fr: 'Pour les étudiants : plus d’outils et de limites, 3 jours d’essai gratuit.',
      en: 'For students: more tools and higher limits, 3-day free trial.',
    },
    price: 2500,
    currency: 'XOF',
    trialDays: 3,
    features: [
      { fr: 'Tous les outils Élève + professionnels', en: 'All Pupil tools + professional tools' },
      { fr: '3 jours d’essai gratuit', en: '3-day free trial' },
      { fr: 'Limites étendues', en: 'Extended limits' },
      { fr: 'Forum du plan Étudiant', en: 'Student plan forum' },
    ],
    limits: { toolsPerDay: 100 },
    adsDuringTrial: true,
    showAds: true,
    forumEnabled: true,
    active: true,
    order: 2,
    isSystem: true,
  },
  {
    key: 'business',
    name: { fr: 'Plan Business', en: 'Business Plan' },
    description: {
      fr: 'Pour les professionnels : accès complet, sans publicité.',
      en: 'For professionals: full access, ad-free.',
    },
    price: 5000,
    currency: 'XOF',
    trialDays: 0,
    features: [
      { fr: 'Accès illimité à tous les outils', en: 'Unlimited access to all tools' },
      { fr: 'Sans publicité', en: 'Ad-free' },
      { fr: 'Générateur de flyers professionnels', en: 'Professional flyer generator' },
      { fr: 'Support prioritaire', en: 'Priority support' },
      { fr: 'Forum du plan Business', en: 'Business plan forum' },
    ],
    limits: {},
    adsDuringTrial: false,
    showAds: false,
    forumEnabled: true,
    active: true,
    order: 3,
    isSystem: true,
  },
];

/** Tool catalog. `planKeys` is the default assignment; admin can change it. */
export const DEFAULT_TOOLS = [
  // Documents
  { key: 'pdf-edit', name: { fr: 'Édition PDF', en: 'PDF Editing' }, category: 'documents', href: '/services/documents', icon: 'FileText', planKeys: ['gratuit', 'eleve', 'etudiant', 'business'], order: 1 },
  { key: 'pdf-merge', name: { fr: 'Fusion de PDF', en: 'Merge PDF' }, category: 'documents', href: '/services/documents', icon: 'FilePlus', planKeys: ['gratuit', 'eleve', 'etudiant', 'business'], order: 2 },
  { key: 'pdf-sign', name: { fr: 'Signature électronique', en: 'E-signature' }, category: 'documents', href: '/services/documents', icon: 'PenTool', planKeys: ['etudiant', 'business'], order: 3 },
  // Conversion
  { key: 'convert-pdf-word', name: { fr: 'PDF → Word', en: 'PDF → Word' }, category: 'conversion', href: '/services/conversion', icon: 'RefreshCw', planKeys: ['gratuit', 'eleve', 'etudiant', 'business'], order: 4 },
  { key: 'convert-img-pdf', name: { fr: 'Images → PDF', en: 'Images → PDF' }, category: 'conversion', href: '/services/conversion', icon: 'Image', planKeys: ['gratuit', 'eleve', 'etudiant', 'business'], order: 5 },
  // Translation
  { key: 'text-translation', name: { fr: 'Traduction de texte', en: 'Text Translation' }, category: 'translation', href: '/services/translation', icon: 'Globe', planKeys: ['gratuit', 'eleve', 'etudiant', 'business'], order: 6 },
  // Professional
  { key: 'cv-generator', name: { fr: 'Générateur de CV', en: 'Resume Generator' }, category: 'professional', href: '/services/professional', icon: 'Briefcase', planKeys: ['etudiant', 'business'], order: 7 },
  { key: 'cover-letter', name: { fr: 'Lettre de motivation', en: 'Cover Letter' }, category: 'professional', href: '/services/professional', icon: 'FileSignature', planKeys: ['etudiant', 'business'], order: 8 },
  // Content
  { key: 'banner-generator', name: { fr: 'Générateur de bannières', en: 'Banner Generator' }, category: 'content', href: '/services/content', icon: 'Palette', planKeys: ['business'], order: 9 },
  // The new flyer generator (Phase 4)
  {
    key: 'flyer-generator',
    name: { fr: 'Générateur de flyers professionnels', en: 'Professional Flyer Generator' },
    description: { fr: 'Créez des flyers professionnels prêts à imprimer.', en: 'Create print-ready professional flyers.' },
    category: 'content',
    href: '/services/content/flyer',
    icon: 'LayoutTemplate',
    planKeys: ['etudiant', 'business'],
    isPremium: true,
    order: 10,
  },
  // Business
  { key: 'business-plan', name: { fr: 'Business plan', en: 'Business Plan' }, category: 'business', href: '/services/business', icon: 'TrendingUp', planKeys: ['business'], order: 11 },
];

export interface SeedResult {
  plansCreated: number;
  toolsCreated: number;
}

/** Insert any default plan/tool that does not yet exist. Idempotent. */
export async function seedDefaults(): Promise<SeedResult> {
  let plansCreated = 0;
  let toolsCreated = 0;

  for (const p of DEFAULT_PLANS) {
    const exists = await Plan.findOne({ key: p.key }).lean();
    if (!exists) {
      await Plan.create(p);
      plansCreated++;
    }
  }

  for (const tDef of DEFAULT_TOOLS) {
    const exists = await Tool.findOne({ key: tDef.key }).lean();
    if (!exists) {
      await Tool.create(tDef);
      toolsCreated++;
    }
  }

  return { plansCreated, toolsCreated };
}
