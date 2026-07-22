import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCategoriesForSelect } from "@/lib/data/admin";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await getCategoriesForSelect();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm text-bordeaux/60 transition-colors hover:text-bordeaux"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
        Produits
      </Link>
      <h1 className="font-serif text-3xl text-bordeaux">Nouveau produit</h1>

      {categories.length === 0 ? (
        <p className="rounded-xl border border-border/70 bg-cream-50 p-6 text-sm text-bordeaux/60">
          Créez d'abord une{" "}
          <Link href="/admin/categories/new" className="underline">
            catégorie
          </Link>
          .
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
