import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getProductById, getCategoriesForSelect } from "@/lib/data/admin";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getCategoriesForSelect(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm text-bordeaux/60 transition-colors hover:text-bordeaux"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
        Produits
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-bordeaux">{product.name}</h1>
        <Link
          href={`/produits/${product.slug}`}
          target="_blank"
          className="text-sm text-bordeaux/60 underline hover:text-bordeaux"
        >
          Voir en boutique ↗
        </Link>
      </div>

      <ProductForm
        id={product.id}
        categories={categories}
        initial={{
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          tagline: product.tagline ?? "",
          description: product.description ?? "",
          family: product.family ?? "",
          imageUrl: product.imageUrl ?? "",
          gallery: product.gallery,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          variants: product.variants.map((v) => ({
            id: v.id,
            name: v.name,
            sku: v.sku,
            volumeMl: v.volumeMl,
            priceCents: v.priceCents,
            stock: v.stock,
            isDefault: v.isDefault,
          })),
        }}
      />
    </div>
  );
}
