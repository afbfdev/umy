import { Search } from "lucide-react";

export function ProductFilters({
  query,
  categoryId,
  stock,
  categories,
}: {
  query?: string;
  categoryId?: string;
  stock?: string;
  categories: { id: string; name: string }[];
}) {
  const selectCls =
    "rounded-lg border border-border/70 bg-cream-50 px-3 py-2.5 text-sm text-bordeaux outline-none focus:border-bordeaux";

  return (
    <form
      action="/admin/products"
      method="get"
      className="flex flex-wrap items-center gap-3"
    >
      <div className="relative min-w-[200px] flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bordeaux/40"
          strokeWidth={1.5}
        />
        <input
          type="search"
          name="q"
          defaultValue={query ?? ""}
          placeholder="Nom, slug, famille…"
          className="w-full rounded-lg border border-border/70 bg-cream-50 py-2.5 pl-9 pr-3 text-sm text-bordeaux outline-none placeholder:text-bordeaux/35 focus:border-bordeaux"
        />
      </div>

      <select name="category" defaultValue={categoryId ?? ""} className={selectCls}>
        <option value="">Toutes catégories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select name="stock" defaultValue={stock ?? ""} className={selectCls}>
        <option value="">Tout stock</option>
        <option value="in">En stock</option>
        <option value="low">Stock faible</option>
        <option value="out">Rupture</option>
      </select>

      <button
        type="submit"
        className="rounded-lg bg-bordeaux px-4 py-2.5 text-sm font-medium text-cream-100 transition-colors hover:bg-bordeaux-900"
      >
        Filtrer
      </button>
    </form>
  );
}
