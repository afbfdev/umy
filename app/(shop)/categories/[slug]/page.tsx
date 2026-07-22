import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryMeta,
  getCategoryProductsPage,
  getAllCategorySlugs,
} from "@/lib/data/catalog";
import { ProductCard } from "@/components/product/product-card";
import { Pagination } from "@/components/admin/pagination";

export const revalidate = 300;

const PER_PAGE = 12;

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryMeta(params.slug);
  if (!category) return { title: "Catégorie introuvable" };
  return {
    title: category.name,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const category = await getCategoryMeta(params.slug);
  if (!category) notFound();

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const { products, total, pages } = await getCategoryProductsPage(
    category.id,
    page,
    PER_PAGE,
  );

  const makeHref = (p: number) =>
    p > 1 ? `/categories/${category.slug}?page=${p}` : `/categories/${category.slug}`;

  return (
    <div className="container py-16 md:py-20">
      {/* Fil d'Ariane */}
      <nav className="mb-8 text-xs uppercase tracking-[0.15em] text-bordeaux/50">
        <Link href="/" className="hover:text-bordeaux">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-bordeaux">
          Univers
        </Link>
        <span className="mx-2">/</span>
        <span className="text-bordeaux">{category.name}</span>
      </nav>

      <header className="mb-12 max-w-2xl">
        <h1 className="text-display-sm text-bordeaux">{category.name}</h1>
        {category.description && (
          <p className="mt-4 text-base leading-relaxed text-bordeaux/70">
            {category.description}
          </p>
        )}
        <p className="mt-4 text-xs uppercase tracking-[0.15em] text-bordeaux/45">
          {total} {total > 1 ? "références" : "référence"}
        </p>
      </header>

      {products.length === 0 ? (
        <p className="text-bordeaux/60">
          Aucun produit dans cette catégorie pour le moment.
        </p>
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
