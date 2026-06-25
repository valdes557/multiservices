# 🏗️ Architecture — Nouveaux outils

## Arborescence ajoutée
```
src/
├── app/
│   ├── tools/
│   │   ├── page.tsx                    # Index de tous les outils (SEO)
│   │   ├── currency-converter/         # Outil 1
│   │   ├── document-generator/         # Outil 2
│   │   ├── text-corrector/             # Outil 3
│   │   ├── loan-calculator/            # Outil 4
│   │   ├── unit-converter/             # Outil 5
│   │   ├── adsense-calculator/         # Outil 6
│   │   ├── cv-generator/               # Outil 7 (premium)
│   │   └── banner-generator/           # Outil 8 (premium)
│   │   # chaque outil = layout.tsx (metadata+JSON-LD) + page.tsx (client)
│   ├── api/text/route.ts               # Correction texte (IA + fallback local)
│   ├── sitemap.ts                      # Sitemap XML dynamique
│   └── robots.ts                       # robots.txt
├── components/
│   ├── JsonLd.tsx                      # Composant données structurées
│   └── tools/
│       ├── ToolLayout.tsx              # Layout réutilisable d'outil
│       └── ToolIcon.tsx                # Mapping d'icônes
├── hooks/
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
└── lib/
    ├── tools.ts                        # Registre central des outils (SEO, nav, sitemap)
    ├── seo.ts                          # buildMetadata + JSON-LD helpers
    ├── units.ts                        # Données + logique de conversion
    ├── documents.ts                    # 10 modèles de documents
    ├── textTools.ts                    # Transformations de texte
    └── services/currency.ts            # Service API taux de change
```

## Principes
- **Composants réutilisables** : ToolLayout, ToolIcon, JsonLd
- **Hooks personnalisés** : useDebounce, useLocalStorage
- **Services API isolés** : lib/services/*
- **Registre unique** (lib/tools.ts) → source de vérité pour l'index, la nav, le sitemap et le SEO
- **SEO par page** : chaque outil expose ses metadata via un layout serveur, la page reste cliente
- **Scalable** : ajouter un outil = 1 entrée dans tools.ts + 1 dossier (layout+page)
- **Responsive** : grilles Tailwind (sm/lg), aperçus scalés
