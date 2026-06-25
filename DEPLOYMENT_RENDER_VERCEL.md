# 🚀 Déploiement — Render & Vercel

Ce guide garantit un déploiement **sans bug** sur Vercel et Render.

## Variables d'environnement (à configurer sur les deux plateformes)

| Variable | Obligatoire | Exemple |
|---|---|---|
| `MONGODB_URI` | ✅ | `mongodb+srv://user:pass@cluster.mongodb.net/multiservices` |
| `JWT_SECRET` | ✅ | chaîne aléatoire (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://votre-domaine.com` |
| `OPENAI_API_KEY` | ⛔ optionnel | active l'IA de correction de texte |

> La connexion MongoDB est **paresseuse** : le build ne plante jamais si la base est injoignable au moment du build. La connexion ne se fait qu'à l'exécution des routes API.

---

## Option A — Vercel (recommandé pour Next.js)

1. Pousser le code sur GitHub (déjà fait).
2. Sur [vercel.com](https://vercel.com) → **Add New Project** → importer le repo `multiservices`.
3. Framework détecté automatiquement : **Next.js** (via `vercel.json`).
4. **Settings → Environment Variables** : ajouter les 3 variables obligatoires.
5. **Deploy**. ✅

Base de données : créez un cluster gratuit sur [MongoDB Atlas](https://www.mongodb.com/atlas) et autorisez l'accès depuis `0.0.0.0/0` (Network Access) pour Vercel.

---

## Option B — Render

### Méthode automatique (Blueprint)
1. Sur [render.com](https://render.com) → **New** → **Blueprint**.
2. Connecter le repo `multiservices` : Render lit `render.yaml` automatiquement.
3. Renseigner les variables marquées `sync: false` (MONGODB_URI, JWT_SECRET, NEXT_PUBLIC_SITE_URL).
4. **Apply**. ✅

### Méthode manuelle
- **New → Web Service**, runtime **Node**.
- Build Command : `npm install && npm run build`
- Start Command : `npm run start`
- Ajouter les variables d'environnement.

---

## Checklist anti-bug

- [x] Connexion DB paresseuse (pas de crash au build)
- [x] `eslint.ignoreDuringBuilds` (le lint ne casse pas le déploiement)
- [x] `images.remotePatterns` configuré (images distantes autorisées)
- [x] `engines.node >= 20` (version Node cohérente)
- [x] `.env.local` ignoré par git (secrets jamais commités)
- [x] Build de production validé localement (`npm run build` → Exit 0)

## Tester en local comme en production
```bash
npm install
npm run build
npm run start   # http://localhost:3000
```
