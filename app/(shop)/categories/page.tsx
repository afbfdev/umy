import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategories } from "@/lib/data/catalog";
import { coverStyle } from "@/lib/visuals";

export const metadata: Metadata = {
  title: "Toutes les catégories",
  description: "Explorez toutes les catégories de la boutique UMY — mode, beauté, maison, high-tech et plus.",
};

export const revalidate = 300;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container py-20">
      <header className="mb-14 max-w-2xl">
        <p className="eyebrow">Explorer</p>
        <h1 className="mt-4 text-display-sm text-bordeaux">Nos catégories</h1>
        <p className="mt-5 text-base leading-relaxed text-bordeaux/70">
          Parcourez tous nos rayons — il y a forcément ce qu'il vous faut.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[3px] p-7"
          >
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              style={coverStyle(category.imageUrl, category.slug)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bordeaux/55 via-bordeaux/10 to-transparent" />
            <div className="relative z-10 text-cream-50">
              <span className="text-[0.65rem] uppercase tracking-luxe text-cream-100/80">
                {category._count.products} produits
              </span>
              <h2 className="mt-2 font-serif text-3xl">{category.name}</h2>
              {category.description && (
                <p className="mt-2 max-w-xs text-sm text-cream-100/85">
                  {category.description}
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em]">
                Découvrir
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
