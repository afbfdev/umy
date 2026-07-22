import type { Metadata } from "next";
import { Search } from "lucide-react";
import { searchProducts } from "@/lib/data/catalog";
import { ProductCard } from "@/components/product/product-card";
import { Pagination } from "@/components/admin/pagination";

export const metadata: Metadata = {
  title: "Recherche",
  robots: { index: false },
};

const PER_PAGE = 12;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const { products, total, pages } = query
    ? await searchProducts(query, page, PER_PAGE)
    : { products: [], total: 0, pages: 1 };

  const makeHref = (p: number) => {
    const params = new URLSearchParams();
    params.set("q", query);
    if (p > 1) params.set("page", String(p));
    return `/recherche?${params.toString()}`;
  };

  return (
    <div className="container py-16 md:py-20">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow">Recherche</p>
        <h1 className="mt-4 text-display-sm text-bordeaux">
          {query ? `« ${query} »` : "Rechercher"}
        </h1>
        {query && (
          <p className="mt-3 text-sm text-bordeaux/55">
            {total} résultat{total > 1 ? "s" : ""}
          </p>
        )}
      </header>

      {/* Champ de recherche (raffinement) */}
      <form action="/recherche" method="get" className="relative mb-12 max-w-xl">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bordeaux/40"
          strokeWidth={1.5}
        />
        <input
          type="search"
          name="q"
          defaultValue={query}
          autoFocus={!query}
          placeholder="Rechercher un produit, une catégorie…"
          className="w-full rounded-full border border-border/70 bg-cream-50 py-3 pl-11 pr-4 text-sm text-bordeaux outline-none placeholder:text-bordeaux/35 focus:border-bordeaux"
        />
      </form>

      {!query ? (
        <p className="text-bordeaux/60">
          Saisissez un terme pour explorer nos créations.
        </p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-cream-50 p-10 text-center">
          <p className="text-bordeaux/70">
            Aucun résultat pour « {query} ».
          </p>
          <p className="mt-2 text-sm text-bordeaux/50">
            Essayez un autre terme (nom, marque, catégorie…).
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-14">
            <Pagination page={page} pages={pages} makeHref={makeHref} />
          </div>
        </>
      )}
    </div>
  );
}
