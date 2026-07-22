import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProductSlugs } from "@/lib/data/catalog";
import {
  VariantSelector,
  type VariantOption,
} from "@/components/product/variant-selector";
import { coverStyle } from "@/lib/visuals";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.description ?? product.tagline ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const variants: VariantOption[] = product.variants.map((v) => ({
    id: v.id,
    name: v.name,
    priceCents: v.priceCents,
    compareAtCents: v.compareAtCents,
    currency: v.currency,
    stock: v.stock,
    isDefault: v.isDefault,
  }));

  return (
    <div className="container py-12 md:py-16">
      {/* Fil d'Ariane */}
      <nav className="mb-8 text-xs uppercase tracking-[0.15em] text-bordeaux/50">
        <Link href="/" className="hover:text-bordeaux">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:text-bordeaux"
        >
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-bordeaux">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Visuel */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-[3px] lg:aspect-[4/5]">
            <div className="absolute inset-0" style={coverStyle(product.imageUrl, product.slug)} />
            {!product.imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[6rem] leading-none text-cream-100/25">
                  UMY
                </span>
              </div>
            )}
          </div>

          {product.gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {product.gallery.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="aspect-square overflow-hidden rounded-[2px]"
                  style={coverStyle(src, product.slug)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Détails */}
        <div className="flex flex-col justify-center">
          {product.family && (
            <p className="eyebrow">{product.family}</p>
          )}
          <h1 className="mt-3 text-display-sm text-bordeaux">{product.name}</h1>
          {product.tagline && (
            <p className="mt-3 text-base text-bordeaux/60">{product.tagline}</p>
          )}

          {product.description && (
            <p className="mt-6 max-w-md leading-relaxed text-bordeaux/75">
              {product.description}
            </p>
          )}

          <div className="mt-9">
            <VariantSelector
              productId={product.id}
              productName={product.name}
              productSlug={product.slug}
              variants={variants}
            />
          </div>

          {/* Réassurance */}
          <ul className="mt-10 space-y-2 border-t border-border/60 pt-6 text-sm text-bordeaux/60">
            <li>· Livraison offerte dès 80 € d'achat</li>
            <li>· Expédition soignée sous 48 h</li>
            <li>· Paiement à la livraison · retours 30 jours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
