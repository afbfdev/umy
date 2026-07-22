"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { CATALOG_TAG } from "@/lib/cache-tags";

export type CategoryInput = {
  name: string;
  slug: string;
  description: string;
  position: number;
  isFeatured: boolean;
  imageUrl: string;
};

export type CategoryFieldErrors = Partial<Record<keyof CategoryInput, string>>;
export type CategoryActionResult =
  | { ok: true }
  | { ok: false; error?: string; fieldErrors?: CategoryFieldErrors };

function validate(input: CategoryInput): CategoryFieldErrors {
  const errors: CategoryFieldErrors = {};
  if (!input.name?.trim()) errors.name = "Nom requis";
  if (input.slug && !/^[a-z0-9-]+$/.test(input.slug))
    errors.slug = "Slug invalide (minuscules, chiffres, tirets)";
  if (Number.isNaN(input.position)) errors.position = "Position invalide";
  return errors;
}

function revalidateAll() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  revalidatePath("/categories"); // vitrine
  revalidatePath("/"); // page d'accueil
  revalidateTag(CATALOG_TAG); // invalide le cache des suggestions
}

export async function createCategory(
  input: CategoryInput,
): Promise<CategoryActionResult> {
  const fieldErrors = validate(input);
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  const slug = (input.slug?.trim() || slugify(input.name)).trim();
  const exists = await prisma.category.findUnique({ where: { slug } });
  if (exists) return { ok: false, fieldErrors: { slug: "Ce slug est déjà utilisé." } };

  await prisma.category.create({
    data: {
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || null,
      position: input.position,
      isFeatured: input.isFeatured,
      imageUrl: input.imageUrl?.trim() || null,
    },
  });

  revalidateAll();
  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<CategoryActionResult> {
  const fieldErrors = validate(input);
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  const slug = (input.slug?.trim() || slugify(input.name)).trim();
  const clash = await prisma.category.findFirst({
    where: { slug, NOT: { id } },
  });
  if (clash) return { ok: false, fieldErrors: { slug: "Ce slug est déjà utilisé." } };

  await prisma.category.update({
    where: { id },
    data: {
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || null,
      position: input.position,
      isFeatured: input.isFeatured,
      imageUrl: input.imageUrl?.trim() || null,
    },
  });

  revalidateAll();
  redirect("/admin/categories");
}

export async function deleteCategory(id: string): Promise<CategoryActionResult> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) return { ok: false, error: "Catégorie introuvable." };
  if (category._count.products > 0) {
    return {
      ok: false,
      error: `Impossible : ${category._count.products} produit(s) rattaché(s). Déplacez-les ou supprimez-les d'abord.`,
    };
  }

  await prisma.category.delete({ where: { id } });
  revalidateAll();
  return { ok: true };
}
