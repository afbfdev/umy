import Link from "next/link";
import { Plus, Pencil, Star, EyeOff } from "lucide-react";
import { getAdminProducts, getCategoriesForSelect } from "@/lib/data/admin";
import { formatPrice } from "@/lib/utils";
import { coverStyle } from "@/lib/visuals";
import { type StockState } from "@/lib/inventory";
import { StockBadge } from "@/components/admin/stock-badge";
import { ProductFilters } from "@/components/admin/product-filters";
import { ProductDeleteButton } from "@/components/admin/product-delete-button";
import { Pagination } from "@/components/admin/pagination";

const PER_PAGE = 12;

function parseStock(v?: string): StockState | undefined {
  return v === "in" || v === "low" || v === "out" ? v : undefined;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; stock?: string; page?: string };
}) {
  const query = searchParams.q?.trim() || undefined;
  const categoryId = searchParams.category || undefined;
  const stock = parseStock(searchParams.stock);
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const [{ products, total, pages }, categories] = await Promise.all([
    getAdminProducts({ query, categoryId, stock, page, perPage: PER_PAGE }),
    getCategoriesForSelect(),
  ]);

  const makeHref = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (categoryId) params.set("category", categoryId);
    if (stock) params.set("stock", stock);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/admin/products?${qs}` : "/admin/products";
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-bordeaux/50">
            Catalogue
          </p>
          <h1 className="mt-1 font-serif text-3xl text-bordeaux">Produits</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-bordeaux px-4 py-2.5 text-sm font-medium text-cream-100 transition-colors hover:bg-bordeaux-900"
        >
          <Plus className="h-4 w-4" strokeWidth={1.8} />
          Nouveau produit
        </Link>
      </header>

      <ProductFilters
        query={query}
        categoryId={categoryId}
        stock={stock}
        categories={categories}
      />

      <p className="text-sm text-bordeaux/55">
        {total} produit{total > 1 ? "s" : ""}
      </p>

      {products.length === 0 ? (
        <div className="rounded-xl border border-border/70 bg-cream-50 p-10 text-center text-sm text-bordeaux/60">
          Aucun produit ne correspond à ces critères.
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-xl border border-border/70 bg-cream-50 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-[0.1em] text-bordeaux/45">
                  <th className="px-4 py-3 font-medium">Produit</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium">Décl.</th>
                  <th className="px-4 py-3 font-medium">Prix dès</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {products.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-nude/15">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 shrink-0 overflow-hidden rounded-md"
                          style={coverStyle(p.imageUrl, p.slug)}
                        />
                        <span className="inline-flex items-center gap-2 font-medium text-bordeaux">
                          {p.isFeatured && (
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          )}
                          {!p.isActive && (
                            <EyeOff className="h-3.5 w-3.5 text-bordeaux/40" />
                          )}
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-bordeaux/70">{p.category.name}</td>
                    <td className="px-4 py-3 text-bordeaux/70">{p.variants.length}</td>
                    <td className="px-4 py-3 text-bordeaux/70">
                      {p.minPriceCents !== null ? formatPrice(p.minPriceCents) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StockBadge total={p.totalStock} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${p.id}`}
                          aria-label={`Modifier ${p.name}`}
                          className="text-bordeaux/50 transition-colors hover:text-bordeaux"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.6} />
                        </Link>
                        <ProductDeleteButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <ul className="space-y-3 md:hidden">
            {products.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-border/70 bg-cream-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="inline-flex items-center gap-2 font-medium text-bordeaux">
                      {p.isFeatured && (
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      )}
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-xs text-bordeaux/50">
                      {p.category.name} · {p.variants.length} décl.
                    </p>
                  </div>
                  <StockBadge total={p.totalStock} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-bordeaux">
                    {p.minPriceCents !== null ? formatPrice(p.minPriceCents) : "—"}
                  </span>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-sm text-bordeaux/70 hover:text-bordeaux"
                    >
                      Modifier
                    </Link>
                    <ProductDeleteButton id={p.id} name={p.name} />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Pagination page={page} pages={pages} makeHref={makeHref} />
        </>
      )}
    </div>
  );
}
