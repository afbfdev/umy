import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { getAdminCategories } from "@/lib/data/admin";
import { coverStyle } from "@/lib/visuals";
import { CategoryDeleteButton } from "@/components/admin/category-delete-button";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-bordeaux/50">
            Catalogue
          </p>
          <h1 className="mt-1 font-serif text-3xl text-bordeaux">Catégories</h1>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-lg bg-bordeaux px-4 py-2.5 text-sm font-medium text-cream-100 transition-colors hover:bg-bordeaux-900"
        >
          <Plus className="h-4 w-4" strokeWidth={1.8} />
          Nouvelle catégorie
        </Link>
      </header>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-border/70 bg-cream-50 p-10 text-center text-sm text-bordeaux/60">
          Aucune catégorie. Créez la première.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-cream-50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-[0.1em] text-bordeaux/45">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Position</th>
                <th className="px-4 py-3 font-medium">Produits</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {categories.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-nude/15">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 shrink-0 overflow-hidden rounded-md"
                        style={coverStyle(c.imageUrl, c.slug)}
                      />
                      <span className="inline-flex items-center gap-2 font-medium text-bordeaux">
                        {c.isFeatured && (
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        )}
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-bordeaux/60">{c.slug}</td>
                  <td className="px-4 py-3 text-bordeaux/70">{c.position}</td>
                  <td className="px-4 py-3 text-bordeaux/70">{c._count.products}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/categories/${c.id}`}
                        aria-label={`Modifier ${c.name}`}
                        className="text-bordeaux/50 transition-colors hover:text-bordeaux"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.6} />
                      </Link>
                      <CategoryDeleteButton id={c.id} name={c.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
