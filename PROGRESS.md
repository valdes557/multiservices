# 📋 PROGRESS — Nouveaux outils multiservices

> Fichier de suivi persistant. Reprendre le travail ici après toute interruption.
> Branche locale: feat/nouveaux-outils | Dernière maj: 2026-06-24

## Légende
- [ ] À faire  · [~] En cours  · [x] Terminé

## SETUP
- [x] Rapatriement du projet en local
- [x] Init git local + checkpoint baseline
- [x] Dépendances vérifiées (toutes déjà présentes: radix, jspdf, html2canvas, pdf-lib, file-saver)
- [x] ~~Ajout dépendances~~ (recharts, jspdf, html2canvas, shadcn: tabs/select/dialog/slider)
- [x] Hooks (useDebounce, useLocalStorage) + ToolLayout + registre lib/tools.ts + SEO helper
- [~] i18n: libellés FR intégrés (EN extensible via lib/tools.ts titleEn/descEn)
- [x] Lien 'Outils' ajouté à la Navbar

## OUTILS
- [x] Outil 1 — Convertisseur de devises (temps réel, historique, /tools/currency-converter)
- [x] Outil 2 — Générateur de documents admin (10 modèles, formulaire, export PDF)
- [x] Outil 3 — Correction & reformulation de texte (éditeur, 6 modes)
- [x] Outil 4 — Calculateur de prêt (mensualité, amortissement, graphiques)
- [x] Outil 5 — Convertisseur universel (10 catégories d'unités)
- [x] Outil 6 — Vérificateur rentabilité AdSense (+ graphiques)
- [x] Outil 7 — Générateur de CV pro (modèles, aperçu live, PDF, ATS)
- [x] Outil 8 — Générateur de bannières (5 formats, PNG/PDF)

## SEO
- [x] Meta tags dynamiques par page (buildMetadata)
- [x] sitemap.ts (XML)
- [x] robots.ts
- [x] Structured Data (JSON-LD SoftwareApplication)
- [x] Open Graph + Twitter cards
- [x] Pages SEO individuelles par outil

## ARCHITECTURE / LIVRAISON
- [x] Composants réutilisables (ToolLayout, ToolIcon, JsonLd)
- [x] Hooks personnalisés (useDebounce, useLocalStorage)
- [x] Services API (lib/services/currency)
- [x] Responsive (grilles Tailwind)
- [x] Plan de déploiement (DEPLOYMENT.md) + ARCHITECTURE.md
- [ ] Push vers GitHub (via PAT)

## NOTES DE REPRISE
- Stack: Next.js 14 App Router + TS + Tailwind + shadcn + MongoDB(mongoose)
- i18n: useLocale()/t() depuis src/context/LocaleContext + src/lib/i18n.ts
- Auth: useAuth() (isPremium, isTrialActive) depuis src/context/AuthContext
- Écriture GitHub via API = BLOQUÉE (OAuth read-only) → push final par PAT
- Dossier local: C:\Users\simular\projects\multiservices