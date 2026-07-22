"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { CATALOG_TAG } from "@/lib/cache-tags";

export type VariantInput = {
  id?: string;
  name: string;
  sku: string;
  volumeMl: number | null;
  priceCents: number;
  stock: number;
  isDefault: boolean;
};

export type ProductInput = {
  name: string;
  slug: string;
  categoryId: string;
  tagline: string;
  description: string;
  family: string;
  imageUrl: string;
  gallery: string[];
  isActive: boolean;
  isFeatured: boolean;
  variants: VariantInput[];
};

export type ProductActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidateAll(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/categories", "layout");
  revalidatePath("/");
  if (slug) revalidatePath(`/produits/${slug}`);
  revalidateTag(CATALOG_TAG); // invalide le cache des suggestions
}

/** Force exactement une déclinaison par défaut. */
function normalizeDefault(variants: VariantInput[]): VariantInput[] {
  const idx = variants.findIndex((v) => v.isDefault);
  const chosen = idx === -1 ? 0 : idx;
  return variants.map((v, i) => ({ ...v, isDefault: i === chosen }));
}

async function validate(
  input: ProductInput,
  productId?: string,
): Promise<string | null> {
  if (!input.name?.trim()) return "Le nom du produit est requis.";
  if (!input.categoryId) return "La catégorie est requise.";

  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });
  if (!category) return "Catégorie introuvable.";

  if (input.variants.length === 0)
    return "Ajoutez au moins une déclinaison.";

  for (const v of input.variants) {
    if (!v.name?.trim()) return "Chaque déclinaison doit avoir un nom.";
    if (!v.sku?.trim()) return "Chaque déclinaison doit avoir un SKU.";
    if (!Number.isFinite(v.priceCents) || v.priceCents < 0)
      return `Prix invalide pour « ${v.name} ».`;
    if (!Number.isInteger(v.stock) || v.stock < 0)
      return `Stock invalide pour « ${v.name} ».`;
  }

  // SKU uniques dans le formulaire
  const skus = input.variants.map((v) => v.sku.trim());
  if (new Set(skus).size !== skus.length)
    return "Deux déclinaisons ont le même SKU.";

  // SKU uniques en base (hors déclinaisons du produit courant)
  const clashes = await prisma.productVariant.findMany({
    where: {
      sku: { in: skus },
      ...(productId ? { productId: { not: productId } } : {}),
    },
    select: { sku: true },
  });
  if (clashes.length > 0)
    return `SKU déjà utilisé : ${clashes.map((c) => c.sku).join(", ")}.`;

  // Slug unique
  const slug = (input.slug?.trim() || slugify(input.name)).trim();
  const slugClash = await prisma.product.findFirst({
    where: { slug, ...(productId ? { NOT: { id: productId } } : {}) },
  });
  if (slugClash) return "Ce slug produit est déjà utilisé.";

  return null;
}

export async function createProduct(
  input: ProductInput,
): Promise<ProductActionResult> {
  const error = await validate(input);
  if (error) return { ok: false, error };

  const slug = (input.slug?.trim() || slugify(input.name)).trim();
  const variants = normalizeDefault(input.variants);

  await prisma.product.create({
    data: {
      name: input.name.trim(),
      slug,
      categoryId: input.categoryId,
      tagline: input.tagline?.trim() || null,
      description: input.description?.trim() || null,
      family: input.family?.trim() || null,
      imageUrl: input.imageUrl?.trim() || null,
      gallery: input.gallery.filter(Boolean),
      isActive: input.isActive,
      isFeatured: input.isFeatured,
      stockTotal: variants.reduce((s, v) => s + v.stock, 0),
      variants: {
        create: variants.map((v) => ({
          name: v.name.trim(),
          sku: v.sku.trim(),
          volumeMl: v.volumeMl,
          priceCents: v.priceCents,
          stock: v.stock,
          isDefault: v.isDefault,
        })),
      },
    },
  });

  revalidateAll(slug);
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<ProductActionResult> {
  const error = await validate(input, id);
  if (error) return { ok: false, error };

  const slug = (input.slug?.trim() || slugify(input.name)).trim();
  const variants = normalizeDefault(input.variants);

  const existing = await prisma.productVariant.findMany({
    where: { productId: id },
    select: { id: true },
  });
  const keptIds = variants.filter((v) => v.id).map((v) => v.id as string);
  const toDelete = existing.filter((e) => !keptIds.includes(e.id)).map((e) => e.id);

  await prisma.$transaction(async (tx) => {
    if (toDelete.length > 0) {
      await tx.productVariant.deleteMany({ where: { id: { in: toDelete } } });
    }
    for (const v of variants) {
      const data = {
        name: v.name.trim(),
        sku: v.sku.trim(),
        volumeMl: v.volumeMl,
        priceCents: v.priceCents,
        stock: v.stock,
        isDefault: v.isDefault,
      };
      if (v.id) {
        await tx.productVariant.update({ where: { id: v.id }, data });
      } else {
        await tx.productVariant.create({ data: { ...data, productId: id } });
      }
    }
    await tx.product.update({
      where: { id },
      data: {
        name: input.name.trim(),
        slug,
        categoryId: input.categoryId,
        tagline: input.tagline?.trim() || null,
        description: input.description?.trim() || null,
        family: input.family?.trim() || null,
        imageUrl: input.imageUrl?.trim() || null,
        gallery: input.gallery.filter(Boolean),
        isActive: input.isActive,
        isFeatured: input.isFeatured,
        stockTotal: variants.reduce((s, v) => s + v.stock, 0),
      },
    });
  });

  revalidateAll(slug);
  redirect("/admin/products");
}

export async function deleteProduct(id: string): Promise<ProductActionResult> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { ok: false, error: "Produit introuvable." };

  await prisma.product.delete({ where: { id } }); // cascade → variants
  revalidateAll(product.slug);
  return { ok: true };
}
