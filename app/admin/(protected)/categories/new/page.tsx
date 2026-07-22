import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-sm text-bordeaux/60 transition-colors hover:text-bordeaux"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
        Catégories
      </Link>
      <h1 className="font-serif text-3xl text-bordeaux">Nouvelle catégorie</h1>
      <CategoryForm />
    </div>
  );
}
