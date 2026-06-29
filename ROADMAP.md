# MultiServices — Feuille de route & état d'avancement

> Document de suivi pour reprendre le travail facilement. **Mettre à jour les cases à
> cocher au fur et à mesure.** Chaque phase = un (ou plusieurs) commit(s).

Stack : Next.js 14 (App Router) · React 18 · TypeScript · MongoDB/Mongoose · Tailwind ·
JWT (jsonwebtoken + bcryptjs). Compte admin de référence : `valdeslando15@gmail.com`.

---

## Cahier des charges (demande client)

1. 3 plans d'abonnement — **élève**, **étudiant**, **business** — configurables par
   l'admin (créer/éditer/supprimer/ajouter), avec prix, fonctionnalités et limites par plan.
2. L'admin active/désactive un plan pour un utilisateur.
3. Plans élève & étudiant : **free trial de 3 jours**. Pendant l'essai, chaque
   fonctionnalité exécutée se termine par une **publicité Google AdSense** — **uniquement si
   AdSense a déjà autorisé l'affichage des pubs sur le site**. Après 3 jours → plus d'accès
   aux outils premium tant que non payé.
4. L'admin attribue chaque outil à chaque plan.
5. **Ajouter l'outil « Générateur de flyers professionnels ».**
6. L'admin active/désactive le plan d'un user même pendant le free trial.
7. À la création d'un plan, l'admin peut préciser le nombre de jours de free trial.
8. (cf. 3) Pubs pendant l'essai seulement si AdSense a autorisé les pubs sur le site.
9. Pendant l'essai, l'utilisateur peut payer l'abonnement mensuel pour **arrêter les pubs**.
10. Une fois l'abonnement payé → **pubs bloquées**.
11. Même pendant l'essai, l'admin peut activer le plan mensuel d'un user depuis son
    dashboard et **bloquer les pubs**.
12. Intégrer **Orange Money / MTN Mobile Money** via **SebPay** (https://new.sebpay.bj/fr/docs).
13. Dashboard admin : configurer l'**API test** et l'**API live**. Une fois l'API ajoutée,
    toute **modification/suppression** exige un **code de confirmation envoyé par email** à
    `valdeslando15@gmail.com`.
14. L'intégration des moyens de paiement se fait **sur chaque plan**.
15. **Forum par plan** : tous les users d'un plan peuvent discuter (images, emoji, voix…).
    L'admin a un **contrôle total** (fermer les discussions, modérer, etc.).
16. Users en free trial : **injectés automatiquement** au forum ; **exclus** à la fin de
    l'essai ; **réintégrés** après paiement de l'abonnement.
17. Les forums sont rattachés à chaque plan, gérés par l'admin.

---

## État d'avancement

### ✅ Phase 1 — Fondations (déjà fait avant reprise)
- [x] Modèle `Plan` dynamique (key, name, description, price, currency, **trialDays**,
      features, limits, **adsDuringTrial**, **forumEnabled**, active, order, isSystem).
- [x] Modèle `User.subscription` (status none/trial/active/expired/disabled, dates,
      **adsEnabled**, **activatedByAdmin**, **disabledByAdmin**).
- [x] Modèle `Tool` avec **planKeys** (mapping outil↔plan) + isPremium/active.
- [x] `lib/entitlements.ts` : `effectiveStatus`, `hasPremiumAccess`,
      **`shouldShowAds(sub, plan, adsenseApproved)`**, `canAccessTool`, `trialDaysLeft`.
- [x] API admin : plans CRUD, tools CRUD + assignation, users PATCH
      (assignPlan, **activateMonthly** (bloque pubs), disablePlan/enablePlan, setAds, expire).
- [x] API user : `/api/subscription` (selectPlan → démarre l'essai).
- [x] UI admin (`/admin`) : onglets Plans / Outils / Utilisateurs.
- [x] Seed des 3 plans + catalogue d'outils (flyer-generator déjà référencé).

> Couvre : exigences 1, 2, 4, 6, 7, 11 et la *logique* de 3, 8, 9, 10.

### ⬜ Phase A — Générateur de flyers (exigence 5)
- [ ] Page `/services/content/flyer` : éditeur client (templates, titres, sous-titre, contact,
      couleurs, upload logo/photo), aperçu live.
- [ ] Export **PNG** (html2canvas) + **PDF** (jspdf) — déps déjà présentes.
- [ ] Gating entitlement (outil `flyer-generator`, premium → étudiant/business).
- [ ] Liens depuis `/services` et `/services/content`. i18n FR/EN.

### ✅ Phase B — Settings global + câblage AdSense (exigences 3, 8)
- [x] Modèle `Settings` (singleton) : `adsenseApproved`, `adsenseClientId`, `adsenseSlotTrial`,
      + sous-doc `sebpay` (préparé pour Phase C/D).
- [x] API `/api/settings` (GET public : flags non sensibles) + `/api/admin/settings` (GET/PUT,
      secrets masqués). `lib/settings.ts` (getSettings/publicSettings/adminSettings/activeSebPayKeys).
- [x] `SettingsContext` (client) + composant `TrialAd` affiché **après l'exécution d'un outil**
      pendant l'essai (trial + adsEnabled + adsenseApproved). Câblé dans traduction, contenu, flyer.
      Charge le script AdSense si client id défini, sinon placeholder « Espace publicitaire ».
- [x] Onglet **Réglages** dans `/admin` (toggle « AdSense autorisé », client id, slot, mode SebPay,
      pays, opérateurs).

### ✅ Phase C — Config API paiement + confirmation email (exigences 12, 13)
- [x] `Settings.sebpay` : publicKeyTest/secretKeyTest/publicKeyLive/secretKeyLive, mode,
      baseUrl, country, operators. Secrets **jamais** renvoyés en clair (masqués côté admin).
- [x] UI admin : mode test/live + carte « Clés de paiement » (saisie pk/sk test & live).
- [x] **Flux code de confirmation** : `/api/admin/payment-config/request` génère un code,
      l'envoie à `valdeslando15@gmail.com` (nodemailer, lib/email) ; `/confirm` valide
      (expiration 10 min, 5 tentatives max, usage unique) et applique le changement.
- [x] Modèle `ConfirmationCode` (code, purpose, payload, expiresAt TTL, used, attempts).
- [x] Variables d'env SMTP documentées dans `.env.example`. Fallback dev : code renvoyé
      dans la réponse si SMTP non configuré.

### ✅ Phase D — Paiement Mobile Money par plan (exigences 9, 10, 14)
- [x] `lib/sebpay.ts` (initiateCollection, getCollectionStatus, verifyWebhookSignature HMAC,
      normalizeStatus) + `lib/billing.ts` (applyPaidSubscription → active + bloque les pubs).
- [x] `POST /api/payment/initiate` → SebPay `POST /collections` (callback_url auto).
- [x] `GET /api/payment/status/:ref` → re-check SebPay si pending (fallback webhook).
- [x] `POST /api/webhooks/sebpay` → vérif HMAC-SHA256, idempotent ; sur `approved` →
      `applyPaidSubscription` (status active, +1 mois, **pubs bloquées**).
- [x] `Payment` étendu (planKey, operator, phone, externalReference unique, transactionId, mode).
- [x] UI `subscribe` : sélection plan + opérateur (Orange/MTN/Moov/Wave) + numéro + OTP,
      paiement + polling du statut, message « Payer maintenant pour arrêter les pubs » en essai.
      `TrialAd` pointe vers `/subscribe`.

### ✅ Phase E — Forums par plan (exigences 15, 16, 17)
- [x] Modèle `ForumMessage` (planKey, userId, authorName, type text|image|voice, content,
      attachmentUrl data URL, deleted, createdAt).
- [x] Flag `Plan.forumOpen` (admin ferme/ouvre les discussions).
- [x] Accès dérivé de l'entitlement (`lib/forum.ts` resolveForumAccess) : membres =
      users **trial+active** du plan ; exclus si expired/disabled ; réintégrés après paiement
      (auto, pas de table de membres) → satisfait l'injection/exclusion auto.
- [x] API : `GET/POST /api/forums/:planKey/messages` (poll + envoi gardé), `DELETE .../:id`
      (admin ou auteur), `PATCH /api/admin/forums/:planKey` (open/close/clear), `GET /api/forums`.
- [x] Pièces jointes images/voix stockées en data URL dans le message (MVP, limite ~2.5 Mo).
- [x] UI `/forum` (index) + `/forum/[planKey]` : messages (polling 4 s), emoji picker,
      upload image, enregistrement vocal (MediaRecorder), contrôles admin (ouvrir/fermer/vider,
      supprimer un message). Lien « Forum » dans la navbar (connecté).

> Note : passer le stockage des pièces jointes sur un bucket (S3/Cloudinary) pour la prod ;
> remplacer le polling par WebSocket/SSE si trafic élevé. Modération « bannir » non incluse
> (exclusion gérée par la désactivation du plan côté admin).

---

## 🎉 Toutes les phases (A→E) sont implémentées et poussées sur `feat/nouvelles-fonctionnalites`.

---

## Référence intégration SebPay (https://new.sebpay.bj/fr/docs)

**Base URL** : `https://newapi.sebpay.bj/api/v1/`
**Auth** (headers sur chaque requête) :
- `X-Public-Key` : `pk_test_…` / `pk_live_…` (exposable)
- `X-Secret-Key` : `sk_test_…` / `sk_live_…` (**secret, jamais côté client**)

**Initier une collecte** — `POST /collections`
```json
{
  "amount": 5000, "currency": "XOF", "phone": "22997000000",
  "operator": "mtn",        // mtn | moov | orange | wave
  "country": "BJ",          // BJ, CI, SN…
  "external_reference": "REF8822",
  "callback_url": "https://site/api/webhooks/sebpay",
  "otp_code": "1234"        // si GET /operators → otp_required=true (Orange CI/BF/SN)
}
```
Réponse (enveloppe `{ success, data, message }`) : `data.transaction_id`, `status`
(`pending`), `external_reference`, `amount`, `currency`, `provider_link?` (rediriger si
présent, ex. Wave).

**Vérifier le statut** — `GET /collections/{id_or_reference}` → `status` ∈
`pending | approved | rejected`.

**Webhook** — SebPay POST vers `callback_url` au statut final. Header
`X-SebPay-Signature` = HMAC-SHA256(body, secret key). Vérifier la signature, répondre **200
en < 5 s**, traiter de façon **idempotente** (clé = `transaction_id`). Payload :
`transaction_id, external_reference, status (approved|rejected|pending), amount, currency,
customer_phone, created_at, updated_at`.

---

## Notes techniques / décisions
- Env requis : `MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (optionnel,
  remplacé par Settings), SMTP (`SMTP_HOST/PORT/USER/PASS/FROM`) pour les emails de
  confirmation, `SEBPAY_*` optionnels (préférer la config en base via Settings).
- Pas de WebSocket persistant garanti (Vercel) → forum en **polling** (intervalle court).
- Uploads forum stockés en data URL / route d'upload simple (à industrialiser plus tard
  avec un bucket S3/Cloudinary si besoin).
- L'admin réel doit avoir `role: 'admin'` en base (promouvoir le compte
  `valdeslando15@gmail.com`).
</content>
</invoke>
