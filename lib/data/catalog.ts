import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CATALOG_TAG } from "@/lib/cache-tags";
import type { Suggestion, CategorySuggestion } from "@/lib/search-types";

/* ── Types dérivés des requêtes (payloads Prisma) ─────────────── */

const categoryWithCount =
  Prisma.validator<Prisma.CategoryDefaultArgs>()({
    include: { _count: { select: { products: true } } },
  });
export type CategoryWithCount = Prisma.CategoryGetPayload<typeof categoryWithCount>;

const productCard = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: { variants: true },
});
export type ProductCard = Prisma.ProductGetPayload<typeof productCard>;

const productDetail = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: { variants: true, category: true },
});
export type ProductDetail = Prisma.ProductGetPayload<typeof productDetail>;

const categoryWithProducts =
  Prisma.validator<Prisma.CategoryDefaultArgs>()({
    include: { products: { include: { variants: true } } },
  });
export type CategoryWithProducts = Prisma.CategoryGetPayload<
  typeof categoryWithProducts
>;

/* ── Requêtes ─────────────────────────────────────────────────── */

/** Toutes les catégories, ordonnées, avec le nombre de produits.
 *  Résilient au build : [] si la base est temporairement injoignable. */
export async function getCategories(): Promise<CategoryWithCount[]> {
  try {
    return await prisma.category.findMany({
      orderBy: { position: "asc" },
      include: { _count: { select: { products: true } } },
    });
  } catch {
    return [];
  }
}

/** Une catégorie et ses produits actifs (avec déclinaisons). */
export function getCategoryBySlug(
  slug: string,
): Promise<CategoryWithProducts | null> {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        include: { variants: { orderBy: { priceCents: "asc" } } },
      },
    },
  });
}

/** Métadonnées d'une catégorie (sans charger ses produits). */
export function getCategoryMeta(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export type CategoryProductsPage = {
  products: ProductCard[];
  total: number;
  page: number;
  pages: number;
};

/** Produits actifs d'une catégorie, paginés en base. */
export async function getCategoryProductsPage(
  categoryId: string,
  page = 1,
  perPage = 12,
): Promise<CategoryProductsPage> {
  const safePage = Math.max(1, Math.floor(page));
  const where = { categoryId, isActive: true };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      skip: (safePage - 1) * perPage,
      take: perPage,
      include: { variants: { orderBy: { priceCents: "asc" } } },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page: safePage,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}

/** Un produit et ses déclinaisons + sa catégorie. */
export function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { orderBy: { priceCents: "asc" } },
    },
  });
}

export type ProductSearchPage = {
  products: ProductCard[];
  total: number;
  page: number;
  pages: number;
};

/**
 * Recherche de produits actifs (nom, accroche, famille, catégorie), paginée.
 * Tolérante aux accents et à la casse via `umy_norm` (unaccent + lower),
 * accélérée par des index GIN trigram (voir `prisma/search-setup.ts`).
 */
export async function searchProducts(
  query: string,
  page = 1,
  perPage = 12,
): Promise<ProductSearchPage> {
  const q = query.trim();
  if (!q) return { products: [], total: 0, page: 1, pages: 1 };

  const safePage = Math.max(1, Math.floor(page));
  // Échappe les jokers LIKE dans la saisie utilisateur.
  const pattern = `%${q.replace(/[%_\\]/g, "\\$&")}%`;

  const match = Prisma.sql`
    p."isActive" = true AND (
      umy_norm(p.name) LIKE umy_norm(${pattern})
      OR umy_norm(coalesce(p.tagline, '')) LIKE umy_norm(${pattern})
      OR umy_norm(coalesce(p.family, '')) LIKE umy_norm(${pattern})
      OR umy_norm(c.name) LIKE umy_norm(${pattern})
    )`;

  const [idRows, countRows] = await Promise.all([
    prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT p.id
      FROM products p JOIN categories c ON c.id = p."categoryId"
      WHERE ${match}
      ORDER BY p."isFeatured" DESC, p.name ASC
      LIMIT ${perPage} OFFSET ${(safePage - 1) * perPage}
    `),
    prisma.$queryRaw<{ count: bigint }[]>(Prisma.sql`
      SELECT count(*)::bigint AS count
      FROM products p JOIN categories c ON c.id = p."categoryId"
      WHERE ${match}
    `),
  ]);

  const total = Number(countRows[0]?.count ?? 0);
  const ids = idRows.map((r) => r.id);

  // Chargement typé (avec déclinaisons), en préservant l'ordre du classement.
  const found = ids.length
    ? await prisma.product.findMany({
        where: { id: { in: ids } },
        include: { variants: { orderBy: { priceCents: "asc" } } },
      })
    : [];
  const byId = new Map(found.map((p) => [p.id, p]));
  const products = ids
    .map((id) => byId.get(id))
    .filter((p): p is ProductCard => Boolean(p));

  return {
    products,
    total,
    page: safePage,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}

/** Suggestions d'autocomplétion (produits), légères et rapides. */
async function suggestProductsQuery(
  query: string,
  limit = 6,
): Promise<Suggestion[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const pattern = `%${q.replace(/[%_\\]/g, "\\$&")}%`;

  return prisma.$queryRaw<Suggestion[]>(Prisma.sql`
    SELECT p.slug,
           p.name,
           p.tagline,
           p."imageUrl",
           c.name AS "categoryName",
           (SELECT min(v."priceCents") FROM product_variants v WHERE v."productId" = p.id) AS "minPriceCents"
    FROM products p JOIN categories c ON c.id = p."categoryId"
    WHERE p."isActive" = true AND (
      umy_norm(p.name) LIKE umy_norm(${pattern})
      OR umy_norm(coalesce(p.tagline, '')) LIKE umy_norm(${pattern})
      OR umy_norm(coalesce(p.family, '')) LIKE umy_norm(${pattern})
      OR umy_norm(c.name) LIKE umy_norm(${pattern})
    )
    ORDER BY p."isFeatured" DESC, p.name ASC
    LIMIT ${limit}
  `);
}

/** Suggestions d'autocomplétion (catégories) par nom. */
async function suggestCategoriesQuery(
  query: string,
  limit = 3,
): Promise<CategorySuggestion[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const pattern = `%${q.replace(/[%_\\]/g, "\\$&")}%`;

  return prisma.$queryRaw<CategorySuggestion[]>(Prisma.sql`
    SELECT c.slug,
           c.name,
           count(p.id)::int AS "productCount"
    FROM categories c
    LEFT JOIN products p ON p."categoryId" = c.id AND p."isActive" = true
    WHERE umy_norm(c.name) LIKE umy_norm(${pattern})
    GROUP BY c.id
    ORDER BY c.position ASC, c.name ASC
    LIMIT ${limit}
  `);
}

/**
 * Versions cachées (data cache Next) : dédoublonnent les requêtes identiques
 * — fréquentes pendant la frappe — et sont invalidées par le tag `catalog`
 * dès qu'un produit ou une catégorie change.
 */
export const suggestProducts = unstable_cache(
  suggestProductsQuery,
  ["suggest-products"],
  { tags: [CATALOG_TAG], revalidate: 60 },
);
export const suggestCategories = unstable_cache(
  suggestCategoriesQuery,
  ["suggest-categories"],
  { tags: [CATALOG_TAG], revalidate: 60 },
);

/** Sélection mise en avant pour la page d'accueil. */
export function getFeaturedProducts(take = 4): Promise<ProductCard[]> {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { updatedAt: "desc" },
    take,
    include: { variants: { orderBy: { priceCents: "asc" } } },
  });
}

/* ── Helpers de rendu statique (generateStaticParams) ─────────── */

// Ces fonctions alimentent `generateStaticParams` au build : si la base est
// injoignable/vide au moment du build, on renvoie [] (pages générées à la
// demande via ISR) plutôt que de faire échouer tout le déploiement.
export async function getAllCategorySlugs(): Promise<string[]> {
  try {
    const rows = await prisma.category.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

/* ── Utilitaires métier ───────────────────────────────────────── */

/** Prix le plus bas parmi les déclinaisons (en centimes), ou null. */
export function lowestPriceCents(variants: { priceCents: number }[]): number | null {
  if (variants.length === 0) return null;
  return variants.reduce((min, v) => (v.priceCents < min ? v.priceCents : min), variants[0].priceCents);
}
