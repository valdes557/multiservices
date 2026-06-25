# 🚀 Plan de déploiement — MultiServices

## Prérequis
- Node.js 18+ et npm
- Une base MongoDB (MongoDB Atlas recommandé en production)

## 1. Installation locale
```bash
npm install
cp .env.example .env.local   # puis remplir les variables
npm run dev                  # http://localhost:3000
```

## 2. Variables d'environnement
| Variable | Description | Requis |
|---|---|---|
| `MONGODB_URI` | Chaîne de connexion MongoDB | ✅ |
| `JWT_SECRET` | Secret de signature des tokens | ✅ |
| `NEXT_PUBLIC_SITE_URL` | URL publique (SEO/sitemap/OG) | ✅ |
| `OPENAI_API_KEY` | Correction IA (Outil 3) — sinon moteur local | ⛔ optionnel |

## 3. Build de production
```bash
npm run build
npm run start
```

## 4. Déploiement sur Vercel (recommandé)
1. Pousser le repo sur GitHub
2. Importer le projet sur https://vercel.com/new
3. Ajouter les variables d'environnement (Settings → Environment Variables)
4. Déployer — Vercel détecte Next.js automatiquement

## 5. MongoDB Atlas
1. Créer un cluster gratuit sur https://cloud.mongodb.com
2. Network Access → autoriser 0.0.0.0/0 (ou les IP Vercel)
3. Database Access → créer un utilisateur
4. Copier l'URI dans `MONGODB_URI`

## 6. Vérifications SEO post-déploiement
- `/sitemap.xml` accessible
- `/robots.txt` accessible
- Balises Open Graph (tester avec https://www.opengraph.xyz)
- Données structurées (tester avec https://search.google.com/test/rich-results)
- Soumettre le sitemap dans Google Search Console

## 7. Optionnel — image Open Graph
Ajouter `public/og-default.png` (1200×630) pour l'aperçu par défaut sur les réseaux sociaux.
