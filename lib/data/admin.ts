import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { LOW_STOCK_THRESHOLD, type StockState } from "@/lib/inventory";

/* ── Catégories ───────────────────────────────────────────────── */

const adminCategory = Prisma.validator<Prisma.CategoryDefaultArgs>()({
  include: { _count: { select: { products: true } } },
});
export type AdminCategory = Prisma.CategoryGetPayload<typeof adminCategory>;

export function getAdminCategories(): Promise<AdminCategory[]> {
  return prisma.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
}

export function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
}

export function getCategoriesForSelect() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

/* ── Produits ─────────────────────────────────────────────────── */

const adminProduct = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: { category: true, variants: true },
});
export type AdminProduct = Prisma.ProductGetPayload<typeof adminProduct>;

export type AdminProductRow = AdminProduct & {
  totalStock: number;
  minPriceCents: number | null;
};

export function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: { orderBy: { priceCents: "asc" } },
    },
  });
}

export type AdminProductsQuery = {
  query?: string;
  categoryId?: string;
  stock?: StockState;
  page?: number;
  perPage?: number;
};

export type AdminProductsPage = {
  products: AdminProductRow[];
  total: number;
  page: number;
  pages: number;
};

/** Traduit un état de stock en condition SQL sur la colonne `stockTotal`. */
function stockWhere(
  stock?: StockState,
): Prisma.ProductWhereInput["stockTotal"] {
  if (stock === "out") return { lte: 0 };
  if (stock === "low") return { gte: 1, lte: LOW_STOCK_THRESHOLD };
  if (stock === "in") return { gt: LOW_STOCK_THRESHOLD };
  return undefined;
}

export async function getAdminProducts({
  query,
  categoryId,
  stock,
  page = 1,
  perPage = 12,
}: AdminProductsQuery): Promise<AdminProductsPage> {
  const where: Prisma.ProductWhereInput = {};
  if (categoryId) where.categoryId = categoryId;

  const q = query?.trim();
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { family: { contains: q, mode: "insensitive" } },
    ];
  }

  const stockFilter = stockWhere(stock);
  if (stockFilter) where.stockTotal = stockFilter;

  const safePage = Math.max(1, Math.floor(page));

  // Filtrage + tri + pagination entièrement en base (colonnes indexées).
  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * perPage,
      take: perPage,
      include: { category: true, variants: { orderBy: { priceCents: "asc" } } },
    }),
    prisma.product.count({ where }),
  ]);

  const products: AdminProductRow[] = rows.map((p) => ({
    ...p,
    totalStock: p.stockTotal,
    minPriceCents: p.variants.length ? p.variants[0].priceCents : null,
  }));

  return {
    products,
    total,
    page: safePage,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}

/** Mesure d'audience (7 derniers jours) pour le tableau de bord. */
export async function getAnalyticsStats() {
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const [last7Days, grouped] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: since } } }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 5,
    }),
  ]);

  return {
    last7Days,
    top: grouped.map((g) => ({ path: g.path, count: g._count._all })),
  };
}

/** Compteurs pour le tableau de bord (stock) — comptés en base. */
export async function getInventoryStats() {
  const [products, outOfStock, lowStock] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { stockTotal: { lte: 0 } } }),
    prisma.product.count({
      where: { stockTotal: { gte: 1, lte: LOW_STOCK_THRESHOLD } },
    }),
  ]);
  return { products, outOfStock, lowStock };
}
