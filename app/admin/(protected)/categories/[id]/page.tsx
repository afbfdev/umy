import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getCategoryById } from "@/lib/data/admin";
import { CategoryForm } from "@/components/admin/category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategoryById(params.id);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-sm text-bordeaux/60 transition-colors hover:text-bordeaux"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
        Catégories
      </Link>
      <div>
        <h1 className="font-serif text-3xl text-bordeaux">{category.name}</h1>
        <p className="mt-1 text-sm text-bordeaux/55">
          {category._count.products} produit(s) rattaché(s)
        </p>
      </div>
      <CategoryForm
        id={category.id}
        initial={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          position: category.position,
          isFeatured: category.isFeatured,
          imageUrl: category.imageUrl ?? "",
        }}
      />
    </div>
  );
}
