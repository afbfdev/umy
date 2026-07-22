Agis en tant qu'Expert Lead Developer Full-Stack (Next.js/TypeScript) et UX/UI Designer de niveau international.

CONTEXTE :
Je développe un site e-commerce moderne pour une marque de parfums et beauté nommée "LMY Parfums & Beauté". L'architecture doit être robuste, fortement typée, évolutive et pensée "Mobile-First". L'expérience utilisateur (UX) doit rivaliser avec les plus grandes marques de luxe.

STACK TECHNIQUE EXIGÉE :
- Framework : Next.js 14+ (App Router)
- Langage : TypeScript strict
- Styling : Tailwind CSS + Framer Motion (pour des micro-interactions fluides et subtiles)
- Composants UI : Shadcn UI (accessible et personnalisable)
- Base de données / Auth : PostgreSQL (via Supabase)
- ORM : Prisma

DIRECTIVES DE DESIGN (Basées sur ma charte graphique) :
- Vibe générale : Luxe, minimaliste, épuré, botanique, premium. Les espaces blancs (negative space) doivent être généreux.
- Couleurs principales (à intégrer au thème) :
  - Background principal : Beige/Crème doux (approx. #EBE5D9 ou #F4F1EA)
  - Accent, Boutons & Texte principal : Bordeaux/Marron profond (approx. #4A141C)
  - Secondaire/Détails : Rose poudré/Nude (approx. #DDBFB9)
- Typographie : Élégante (style serif hybride pour les titres, sans-serif minimaliste pour le corps de texte).

FONCTIONNALITÉS CIBLES (Phase 1) :
- Mise en avant visuelle forte des catégories de produits (Parfums, Soins, etc.).
- Navigation fluide et interface épurée.

TÂCHES À ACCOMPLIR :
1. Architecture : Fournis l'arborescence complète et recommandée des dossiers (components, lib, hooks, app) pour ce projet Next.js.
2. Configuration Design : Rédige le fichier `tailwind.config.ts` complet incluant cette palette de couleurs personnalisée et des variables de typographie.
3. Modélisation Data : Crée le fichier `schema.prisma` avec des modèles robustes et relationnels pour `Category`, `Product`, et potentiellement `ProductVariant` (pour les différentes tailles de parfum).
4. Code UI (Page d'accueil) : Génère le code complet (TSX) pour la page `app/page.tsx`. Elle doit inclure :
   - Un "Hero Section" élégant appelant à l'action.
   - Une section "Catégories" présentant les produits sous forme d'une grille asymétrique ou de cartes modernes, avec des effets de hover subtils via Tailwind.