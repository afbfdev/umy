# UMY — Le concept store

Boutique e-commerce en ligne (Mobile-First) **multi-catégories** — mode, beauté,
maison, high-tech et plus. Marque **UMY**.
Stack : **Next.js 14 (App Router) · TypeScript strict · Tailwind CSS · Framer Motion · Shadcn UI · Prisma · PostgreSQL (Supabase)**.

> ℹ️ Le nom de la marque est centralisé dans `lib/site.ts` (`siteConfig.name`).
> Le modifier là le répercute partout (navbar, footer, métadonnées…).

---

## 🎨 Charte graphique

| Rôle | Couleur | Hex |
| --- | --- | --- |
| Fond principal (crème doux) | `cream` | `#EBE5D9` / `#F4F1EA` |
| Accent · texte · boutons (bordeaux) | `bordeaux` | `#4A141C` |
| Détails secondaires (nude) | `nude` | `#DDBFB9` |

- **Titres** : `Fraunces` (serif hybride) → `font-serif`
- **Corps** : `Jost` (sans-serif minimaliste) → `font-sans`

---

## 📁 Arborescence

```
umy/
├─ app/                      # App Router (routes, layouts, styles globaux)
│  ├─ layout.tsx            # Layout racine : polices, Navbar, Footer, métadonnées
│  ├─ page.tsx              # Page d'accueil (Hero + Catégories + réassurance)
│  ├─ not-found.tsx         # Page 404 de marque
│  ├─ categories/
│  │  ├─ page.tsx           # Index des univers (Prisma)
│  │  └─ [slug]/page.tsx    # Page catégorie → produits (Prisma, SSG)
│  ├─ produits/
│  │  └─ [slug]/page.tsx    # Page produit + déclinaisons (Prisma, SSG)
│  ├─ panier/
│  │  └─ page.tsx           # Panier complet (client, persistant)
│  └─ globals.css           # Directives Tailwind + tokens de thème (HSL)
│
├─ components/
│  ├─ ui/                   # Primitives Shadcn (button, sheet)
│  │  ├─ button.tsx
│  │  └─ sheet.tsx          # Tiroir latéral (Radix Dialog)
│  ├─ layout/               # Éléments de gabarit
│  │  ├─ navbar.tsx
│  │  └─ footer.tsx
│  ├─ product/             # Blocs produit
│  │  ├─ product-card.tsx
│  │  └─ variant-selector.tsx   # (client) déclinaison + ajout au panier
│  ├─ cart/                # Panier
│  │  ├─ cart-icon-button.tsx   # Icône navbar + compteur
│  │  ├─ cart-sheet.tsx         # Tiroir latéral
│  │  ├─ cart-view.tsx          # Page /panier
│  │  ├─ cart-line-item.tsx     # Ligne (partagée tiroir/page)
│  │  └─ quantity-stepper.tsx
│  └─ sections/             # Sections composées de pages
│     ├─ hero.tsx
│     └─ categories.tsx
│
├─ lib/                      # Logique partagée, non-UI
│  ├─ data/
│  │  └─ catalog.ts         # Couche d'accès Prisma (requêtes + types)
│  ├─ store/               # State global (Zustand)
│  │  ├─ cart.ts            # Panier persistant (localStorage)
│  │  └─ cart-ui.ts         # Ouverture du tiroir
│  ├─ utils.ts              # cn(), formatPrice()
│  ├─ visuals.ts            # Dégradés placeholder déterministes
│  ├─ prisma.ts             # Singleton Prisma
│  └─ site.ts               # ⚑ Config marque + données vitrine (accueil)
│
├─ hooks/                    # Hooks React réutilisables
│  ├─ use-scroll-position.ts
│  └─ use-mounted.ts        # Anti-mismatch d'hydratation
│
├─ prisma/
│  ├─ schema.prisma         # Modèles Category / Product / ProductVariant
│  └─ seed.ts               # Données de démonstration
│
├─ tailwind.config.ts        # Palette + typographie + animations
├─ components.json           # Config Shadcn UI
├─ next.config.mjs
├─ tsconfig.json
└─ .env.example
```

---

## 🚀 Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2a. Option A — Postgres local du projet (aucune config externe)
npm run db:start            # démarre Postgres (dossier .localdb, port 5433)
#     .env pointe déjà dessus (DATABASE_URL / DIRECT_URL)

# 2b. Option B — Supabase
cp .env.example .env        # puis renseigner DATABASE_URL / DIRECT_URL (Supabase)

# 3. Base de données
npm run db:push             # applique le schéma
npm run db:search-setup     # recherche accent-insensible (extensions + index GIN)
npm run db:seed             # catalogue (4 catégories, 10 produits, 16 déclinaisons)
npm run db:seed:orders      # commandes de démo (back-office)
npm run db:seed:admin       # compte admin (admin@umy.dev / umy-admin-2026)

# ⚑ Générer un secret de session admin dans .env :
#   ADMIN_SESSION_SECRET="$(openssl rand -base64 32)"

# 4. Lancer en développement
npm run dev                 # http://localhost:3000  (admin : /admin)

# Arrêter la base locale
npm run db:stop
```

> La base locale (`.localdb/`) est ignorée par git. Elle persiste entre les
> sessions tant que vous ne supprimez pas le dossier.

---

## 🗺️ Routes principales

| Route | Rendu | Source |
| --- | --- | --- |
| `/` | Statique | Accueil (vitrine) |
| `/categories` | ISR | `prisma.category.findMany` |
| `/categories/[slug]` | SSG + ISR | Catégorie + produits |
| `/produits/[slug]` | SSG + ISR | Produit + déclinaisons |
| `/recherche` | Dynamique | Recherche produits (SQL paginée) |
| `/panier` | Client | Panier persistant (Zustand + localStorage) |
| `/commande` | Client + Server Action | Tunnel de commande (paiement à la livraison) |
| `/commande/confirmation/[orderNumber]` | Dynamique | Confirmation (Prisma) |
| `/admin` | Dynamique | Tableau de bord (KPIs, alerte stock, commandes récentes) |
| `/admin/orders` | Dynamique | Liste filtrable / recherchable / paginée |
| `/admin/orders/[orderNumber]` | Dynamique | Fiche + gestion du statut |
| `/admin/products` | Dynamique | Produits : filtres (catégorie, stock), CRUD |
| `/admin/products/new` · `/[id]` | Dynamique | Créer / éditer (déclinaisons + stock) |
| `/admin/categories` | Dynamique | Catégories : CRUD |
| `/admin/categories/new` · `/[id]` | Dynamique | Créer / éditer |
| `/admin/login` | Dynamique | Connexion admin |

> **Routage** : la vitrine vit dans le groupe `app/(shop)/` (layout avec Navbar/
> Footer) ; l'admin `app/admin/` a son propre layout (sidebar). Le layout racine
> ne porte que `<html>`/polices.

---

## 🛒 Panier

- Store **Zustand** persistant (`localStorage`, clé `umy-cart`) — survit aux
  rechargements.
- **Tiroir latéral** accessible (Radix Dialog) ouvert au clic sur l'icône ou
  après un ajout ; compteur live dans la navbar.
- Gestion des quantités (bornées au stock), suppression, seuil de livraison
  offerte (80 €), page `/panier` avec récapitulatif.
- Bouton « Passer la commande » = placeholder (le tunnel de paiement reste à
  brancher).

---

## 🧾 Commande (paiement à la livraison)

- **Server Action** `app/commande/actions.ts` : recalcule prix et frais de port
  **côté serveur** (jamais les montants du client), vérifie le stock, décrémente
  atomiquement et crée la commande dans une **transaction** Prisma.
- Modèles `Order` / `OrderItem` — les lignes sont un **instantané** figé (la
  commande survit à l'évolution du catalogue).
- Statut initial `PENDING`, mode `CASH_ON_DELIVERY`. Référence lisible
  (`UMY-XXXXXX`) affichée sur la page de confirmation.
- Le tunnel de paiement en ligne (Stripe) pourra remplacer/compléter le COD.

---

## 🛠️ Back-office (`/admin`)

- **Tableau de bord** : CA (hors annulées), nombre de commandes, à traiter,
  expédiées, répartition par statut, commandes récentes.
- **Liste** : recherche (référence / nom / e-mail / ville), filtre par statut,
  pagination — tableau sur desktop, cartes sur mobile.
- **Fiche commande** : articles, totaux, client, adresse, notes.
- **Gestion du statut** via Server Action avec **transitions contrôlées**
  (`En attente → Confirmée → Expédiée → Livrée`, ou `Annulée`). L'annulation
  **restitue le stock**. `revalidatePath` rafraîchit les vues concernées.
- Layout admin **responsive** (sidebar desktop, tiroir mobile), sans le chrome
  de la boutique.
- Données de démo : `npm run db:seed:orders` (6 commandes, statuts variés).

### Catalogue (autonomie complète)

- **Catégories** — créer / modifier / supprimer (slug auto, ordre, mise en
  avant). Suppression **bloquée** si des produits y sont rattachés.
- **Produits** — créer / modifier / supprimer, avec **déclinaisons** éditables
  (nom, SKU, contenance, prix, stock, déclinaison par défaut). Réconciliation
  serveur (ajout / modif / suppression de déclinaisons en une transaction),
  **unicité des SKU** garantie.
- **Stock & ruptures** — stock par déclinaison ; badges *En stock / Stock faible
  / Rupture* ; filtres dédiés ; **alerte stock** sur le tableau de bord. Un
  produit désactivé (`isActive`) disparaît de la boutique.
- **Images** — upload depuis l'admin : image de catégorie, image principale +
  **galerie** produit. Envoi authentifié via `POST /api/admin/upload`
  (png/jpg/webp/gif, max 5 Mo), stockage dans `public/uploads/`. La boutique
  affiche l'image si présente, sinon un **dégradé de repli** (`coverStyle`).
  Stockage local abstrait dans `lib/storage/` → basculable vers S3 / Supabase
  Storage sans toucher au reste.
- Toutes les mutations rafraîchissent la vitrine (`revalidatePath`).

### E-mail transactionnel

- **Confirmation de commande** envoyée à la validation (`lib/email/`).
- Provider **Resend** si `RESEND_API_KEY` est défini ; sinon transport **dev**
  qui journalise l'e-mail (aucun envoi). N'interrompt jamais la commande.

---

## 🔐 Authentification admin

`/admin/*` est protégé (identifiants + session).

- **Middleware** (`middleware.ts`, runtime Edge) : redirige tout accès non
  authentifié vers `/admin/login?next=…`.
- **Sessions** : JWT signé HS256 (`jose`) dans un cookie **httpOnly / SameSite=Lax**
  (`Secure` en prod), valable 7 jours. Secret : `ADMIN_SESSION_SECRET`.
- **Mots de passe** : hachés **bcrypt** (`bcryptjs`), jamais stockés en clair.
  Message de connexion générique (pas d'énumération d'e-mails).
- **Défense en profondeur** : le layout `(protected)` revalide la session côté
  serveur en plus du middleware.
- Modèle `AdminUser`. Compte de démo : `npm run db:seed:admin`
  → `admin@umy.dev` / `umy-admin-2026` **(à changer)**.

> Migration Supabase Auth possible plus tard : remplacer `lib/auth/*` sans
> toucher aux pages. Pensez à définir `ADMIN_SESSION_SECRET` en production
> (`openssl rand -base64 32`).

---

## 💱 Multi-devise

- Sélecteur moderne dans la navbar (drapeau + code) : **EUR 🇫🇷, MAD 🇲🇦,
  FCFA 🇸🇳, GBP 🇬🇧, USD 🇺🇸**. Choix mémorisé en cookie (`umy-currency`).
- Les prix sont **stockés en euro (base)** et **convertis à l'affichage** via le
  composant client `<Price cents={…} />` (réactif au changement de devise).
- **Taux de change en direct** via `open.er-api.com` (gratuit, sans clé,
  supporte MAD/XOF), **mis en cache 1 h** (Next Data Cache, tag `fx-rates`),
  avec **repli automatique** sur les taux statiques de `lib/currency.ts` en cas
  d'indisponibilité. Le layout boutique récupère les taux et les injecte dans
  le `CurrencyProvider`.
- Les commandes restent **enregistrées en euro** (paiement à la livraison) ; un
  avertissement indique que les montants convertis sont indicatifs.

---

## 📱 PWA (Progressive Web App)

Le site est **installable** et fonctionne partiellement **hors ligne**.

- **Manifest** généré par Next (`app/manifest.ts`) : nom, `display: standalone`,
  couleurs, icônes **192 / 512 / maskable** (`public/icons/`).
- **Service worker** maison (`public/sw.js`), stratégie maîtrisée :
  - `cache-first` pour les assets versionnés (`/_next/static`, images, `/uploads`) ;
  - `network-first` pour les pages, avec repli **cache** puis page **`/offline`** ;
  - **jamais** de cache pour `/admin`, `/api` (données sensibles/dynamiques).
- Enregistré **uniquement en production** (`components/pwa/register-sw.tsx`) pour
  ne pas gêner le HMR en dev.
- Métadonnées `theme-color` et `apple-web-app` dans le layout racine.

> Pour tester l'installation / le hors-ligne : `npm run build && npm start`,
> puis DevTools → Application (ou l'icône « Installer » du navigateur).

---

## ⚡ Scalabilité

Toutes les listes filtrent / trient / paginent **en base** (jamais en mémoire) :

- **Commandes** et **produits** (admin), **produits par catégorie** (boutique),
  **audience** : `skip`/`take` + `count` + `groupBy` côté SQL, sur colonnes
  **indexées**.
- Le filtre par état de stock (En stock / faible / rupture) s'appuie sur une
  colonne **dénormalisée `Product.stockTotal`** (indexée), maintenue à chaque
  mouvement : création/édition produit, **commande** (décrément) et
  **annulation** (remise en stock), dans la même transaction que les variantes.
  Invariant vérifié : `stockTotal == Σ(variants.stock)`.
- Index ajoutés : `Product(stockTotal, createdAt, categoryId+isActive)`,
  `Order(createdAt, status+createdAt)`.
- **Recherche produit** (`/recherche`) tolérante aux **accents** et à la casse :
  extension `unaccent` + fonction IMMUTABLE `umy_norm`, accélérée par des
  **index GIN trigram** (`pg_trgm`). Setup via `npm run db:search-setup`
  (idempotent ; à relancer seulement si la base est recréée).

### Mise en cache

- **ISR** sur les pages catalogue (`/`, `/produits/[slug]`, `/categories`,
  `/categories/[slug]`) : `revalidate = 300` + slugs pré-générés au build.
- **Invalidation immédiate** : chaque mutation appelle `revalidatePath` **et**
  `revalidateTag("catalog")` → pas d'attente de la fenêtre ISR après un changement.
- **Data cache** (`unstable_cache`) sur les suggestions d'autocomplétion,
  taggé `catalog` : les requêtes identiques (fréquentes pendant la frappe) ne
  retapent pas Postgres, et se vident dès qu'un produit/catégorie change.
- **Cache HTTP/CDN** sur `/api/search/suggest` :
  `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`.
- Admin & pages sensibles : `force-dynamic` (jamais cachés).

---

## 🧱 Prochaines étapes suggérées

- Gestion multi-comptes admin (rôles) + réinitialisation de mot de passe.
- E-mails d'expédition / de mise à jour de statut (le socle `lib/email/` existe).
- Paiement en ligne (Stripe) en complément du paiement à la livraison.
- Espace compte client (historique de commandes).
- Upload d'images produits/catégories + remplacement des dégradés placeholder
  (`next/image`).
