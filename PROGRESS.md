# 📋 PROGRESS — Nouveaux outils multiservices

> Fichier de suivi persistant. Reprendre le travail ici après toute interruption.
> Branche locale: feat/nouveaux-outils | Dernière maj: 2026-06-24

## Légende
- [ ] À faire  · [~] En cours  · [x] Terminé

## SETUP
- [x] Rapatriement du projet en local
- [x] Init git local + checkpoint baseline
- [ ] Ajout dépendances (recharts, jspdf, html2canvas, shadcn: tabs/select/dialog/slider)
- [ ] Hook réutilisable + service API patterns
- [ ] Entrées i18n FR/EN pour les 8 outils
- [ ] Liens dans Navbar / page d'accueil / /services

## OUTILS
- [ ] Outil 1 — Convertisseur de devises (temps réel, historique, /tools/currency-converter)
- [ ] Outil 2 — Générateur de documents admin (10 modèles, formulaire, export PDF)
- [ ] Outil 3 — Correction & reformulation de texte (éditeur, 6 modes)
- [ ] Outil 4 — Calculateur de prêt (mensualité, amortissement, graphiques)
- [ ] Outil 5 — Convertisseur universel (10 catégories d'unités)
- [ ] Outil 6 — Vérificateur rentabilité AdSense (+ graphiques)
- [ ] Outil 7 — Générateur de CV pro (modèles, aperçu live, PDF, ATS)
- [ ] Outil 8 — Générateur de bannières (5 formats, PNG/PDF)

## SEO
- [ ] Meta tags dynamiques par page (generateMetadata)
- [ ] sitemap.ts (XML)
- [ ] robots.ts
- [ ] Structured Data (JSON-LD)
- [ ] Open Graph + Twitter cards
- [ ] Pages SEO individuelles par outil

## ARCHITECTURE / LIVRAISON
- [ ] Composants réutilisables (ToolLayout, ToolCard...)
- [ ] Hooks personnalisés (useDebounce, useLocalStorage...)
- [ ] Services API (lib/services/*)
- [ ] Responsive complet
- [ ] Plan de déploiement (DEPLOYMENT.md)
- [ ] Push vers GitHub (via PAT)

## NOTES DE REPRISE
- Stack: Next.js 14 App Router + TS + Tailwind + shadcn + MongoDB(mongoose)
- i18n: useLocale()/t() depuis src/context/LocaleContext + src/lib/i18n.ts
- Auth: useAuth() (isPremium, isTrialActive) depuis src/context/AuthContext
- Écriture GitHub via API = BLOQUÉE (OAuth read-only) → push final par PAT
- Dossier local: C:\Users\simular\projects\multiservices
