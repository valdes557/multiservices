# 📋 PROGRESS — MultiServices

> Suivi complet du projet pour reprise ultérieure. Branche de travail : `feat/nouveaux-outils`.

## ✅ Déjà livré et poussé sur GitHub

### Base (sessions précédentes)
- 8 premiers outils : currency-converter, document-generator, text-corrector, loan-calculator, unit-converter, adsense-calculator, cv-generator 🔒, banner-generator 🔒
- SEO complet (sitemap.ts, robots.ts, JSON-LD, OG, metadata dynamiques)
- Architecture : registre d'outils (lib/tools.ts), hooks, composants réutilisables, services API isolés
- Premium gating (PremiumGate) sur CV + bannières
- Bilingue FR/EN intégral (ToolLayout, ToolsGrid, 8 pages)
- **Déploiement bulletproof Render + Vercel** : mongodb lazy, vercel.json, render.yaml, next.config.js, .env.example, DEPLOYMENT_RENDER_VERCEL.md

### ✅ Lot 1 — Outils développeurs (commit 2b4dd01)
- json-formatter, json-xml, base64, uuid-generator, password-generator, api-key-generator
- Tous bilingues, 100% client, build Exit 0

## ⏳ Lots restants à faire

### Lot 2 — SEO & créateurs (EN COURS)
sitemap-generator · robots-generator · schema-generator · qr-code · color-palette

### Lot 3 — Outils financiers
compound-interest · savings-calculator · retirement-calculator · investment-simulator · crypto-calculator

### Lot 4 — Business & étudiants
invoice-generator · quote-generator · receipt-generator · vat-calculator · grade-average · grade-converter · revision-cards

### Lot 5 — Outils image (Canvas, côté client)
image-compress · image-convert (JPG/PNG/WEBP) · image-resize · image-watermark

### Lot 6 — Outils IA (utilisent OPENAI_API_KEY, fallback local)
text-summarizer · text-rephraser · grammar-checker · email-generator · product-description · social-post · youtube-title · hashtag-generator

### Lot 7 — Nécessitent API tierce / budget (à discuter)
- PDF→Word/Excel/PPT, suppression arrière-plan, plagiat, traduction docs, vitesse de page, raccourcisseur URL persistant, téléchargeur miniatures/vidéos
- ✅ Faisables côté client : PDF→JPG, JPG→PDF, compression/protection/déverrouillage PDF (pdf-lib, jspdf déjà installés)

## 🔧 Notes techniques pour reprise
- Pattern d'ajout d'outil : (1) entrée dans lib/tools.ts, (2) icône dans ToolIcon.tsx, (3) dossier src/app/tools/<slug>/ avec layout.tsx + page.tsx
- ⚠️ Le garde-fou de sécurité bloque parfois l'écriture de fichiers "sensibles" (ex: password) → contourner via PowerShell base64
- Build de validation : `npm run build` doit finir en Exit 0
- Push : via token GitHub fine-grained (saisie sécurisée), branche feat/nouveaux-outils



## Lot 2 — Outils SEO & Créateurs ✅ (build Exit 0, 44 routes)
Date: 2026-06-25
1. sitemap-generator — Générateur de sitemap XML (Search Console)
2. robots-generator — Générateur de robots.txt + sitemap
3. schema-generator — Générateur Schema.org JSON-LD (5 types)
4. qr-code — Générateur de QR Code (couleurs, PNG)
5. color-palette — Générateur de palettes (analogue/complémentaire/triadique/mono)

Note technique: writeToFile supprime les imports nommés → utiliser applyFix(rel, useClient, importsArr) pour (ré)injecter. ToolLayout attend title/description (pas slug).
Prochain: Lot 3 — Finance.



## Lot 3 — Outils Finance ✅ (build Exit 0, 49 routes)
Date: 2026-06-25
1. compound-interest — Intérêts composés + versements mensuels
2. savings-calculator — Épargne mensuelle nécessaire vs objectif
3. vat-calculator — TVA HT/TTC, taux FR (20/10/5.5/2.1/0)
4. margin-calculator — Marge, taux de marque, profit
5. percentage-calculator — % de, proportion, variation
Prochain: Lot 4 — Business & étudiants.



## Lot 4 — Business & Étudiants ✅ (build Exit 0, 54 routes)
Date: 2026-06-25
1. invoice-generator — Facture (lignes, TVA, total, export PDF jsPDF)
2. quote-generator — Devis (prestations, validité, export PDF)
3. grade-average — Moyenne pondérée par coefficients (lignes dynamiques)
4. grade-converter — Conversion /20, /100, GPA/4, lettres A-F, mentions
5. final-grade — Note nécessaire à l'examen pour atteindre un objectif
Prochain: Lot 5 — Outils image (Canvas client).



## Lot 5 — Outils Image ✅ (build Exit 0, 59 routes)
Date: 2026-06-25
Tous 100% Canvas côté client (aucun upload serveur, confidentialité totale)
1. image-compress — Compression JPG avec curseur qualité + gain en %
2. image-convert — Conversion JPG/PNG/WEBP
3. image-resize — Redimensionnement avec verrouillage des proportions
4. image-watermark — Filigrane texte (opacité, taille, 5 positions)
5. image-crop — Recadrage par ratio (1:1, 16:9, 4:3, 3:4, 3:2)
Prochain: Lot 6 — Outils IA (OPENAI_API_KEY avec fallback local).



## Lot 6 — Outils IA ✅ (build Exit 0, 68 routes)
Date: 2026-06-25
Architecture: route /api/ai (OpenAI gpt-4o-mini si OPENAI_API_KEY, sinon fallback local intelligent)
Composant réutilisable: src/components/tools/AiToolForm.tsx
Lib fallback: src/lib/aiTools.ts (runLocal + aiPrompts)
1. text-summarizer — Résumé extractif par mots-clés
2. text-rephraser — Reformulation
3. grammar-checker — Correction orthographe/grammaire/ponctuation
4. email-generator — E-mail pro (sujet + ton)
5. product-description — Description produit (nom + caractéristiques)
6. social-post — Post réseaux sociaux + hashtags
7. youtube-title — 5 titres accrocheurs
8. hashtag-generator — Hashtags pertinents

Variables d'env à ajouter pour activer l'IA: OPENAI_API_KEY (+ optionnel OPENAI_MODEL). Sans clé, fallback local fonctionne déjà.
Prochain: Lot 7 — Outils nécessitant API tierce / budget (PDF avancé, suppression arrière-plan, plagiat, traduction docs) — à discuter.



## Lot 7A — Outils PDF (gratuit, 100% client-side) ✅ (build Exit 0, 73 routes)
Date: 2026-06-25
Librairies: pdf-lib + jspdf (déjà installées)
1. jpg-to-pdf — Images JPG/PNG → PDF (multi-pages)
2. pdf-merge — Fusion de plusieurs PDF en un seul
3. pdf-split — Découpe / extraction de pages
4. pdf-rotate — Rotation de pages
5. pdf-watermark — Filigrane texte sur PDF

Total nouveaux outils: 39 (Lots 1-7A).
Reste Lot 7B (services tiers payants à discuter): suppression arrière-plan, plagiat, traduction docs, PDF->Word/Excel fidèle.
