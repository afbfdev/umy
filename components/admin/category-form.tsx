"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import {
  createCategory,
  updateCategory,
  type CategoryInput,
  type CategoryFieldErrors,
} from "@/lib/actions/admin-categories";
import { ImageUploader } from "@/components/admin/image-uploader";

export function CategoryForm({
  id,
  initial,
}: {
  id?: string;
  initial?: Partial<CategoryInput>;
}) {
  const [form, setForm] = useState<CategoryInput>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    position: initial?.position ?? 0,
    isFeatured: initial?.isFeatured ?? false,
    imageUrl: initial?.imageUrl ?? "",
  });
  const [errors, setErrors] = useState<CategoryFieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof CategoryInput>(key: K, value: CategoryInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    startTransition(async () => {
      const res = id
        ? await updateCategory(id, form)
        : await createCategory(form);
      // En cas de succès, l'action redirige (aucun retour ici).
      if (res && !res.ok) {
        if (res.fieldErrors) setErrors(res.fieldErrors);
        if (res.error) setGlobalError(res.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom" error={errors.name}>
          <input
            className={inputCls(errors.name)}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => {
              if (!form.slug.trim() && form.name.trim())
                set("slug", slugify(form.name));
            }}
          />
        </Field>
        <Field label="Slug (URL)" error={errors.slug} hint="laisser vide = généré">
          <input
            className={inputCls(errors.slug)}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder={form.name ? slugify(form.name) : "ex. parfums"}
          />
        </Field>
      </div>

      <Field label="Description" error={errors.description}>
        <textarea
          rows={3}
          className={cn(inputCls(), "resize-none")}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Position (ordre)" error={errors.position}>
          <input
            type="number"
            className={inputCls(errors.position)}
            value={form.position}
            onChange={(e) => set("position", parseInt(e.target.value, 10) || 0)}
          />
        </Field>
      </div>

      <ImageUploader
        label="Image de la catégorie"
        value={form.imageUrl}
        onChange={(url) => set("imageUrl", url)}
      />

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(e) => set("isFeatured", e.target.checked)}
          className="h-4 w-4 accent-[#4A141C]"
        />
        <span className="text-sm text-bordeaux">Mettre en avant (page d'accueil)</span>
      </label>

      {globalError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {globalError}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-border/60 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-bordeaux px-5 py-2.5 text-sm font-medium text-cream-100 transition-colors hover:bg-bordeaux-900 disabled:opacity-50"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {id ? "Enregistrer" : "Créer la catégorie"}
        </button>
        <Link
          href="/admin/categories"
          className="text-sm text-bordeaux/60 hover:text-bordeaux"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-xs uppercase tracking-[0.12em] text-bordeaux/60">
        {label}
        {hint && <span className="normal-case tracking-normal text-bordeaux/35">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function inputCls(error?: string): string {
  return cn(
    "w-full rounded-lg border bg-cream-50 px-3.5 py-2.5 text-sm text-bordeaux outline-none transition-colors placeholder:text-bordeaux/35 focus:border-bordeaux",
    error ? "border-red-400" : "border-border/70",
  );
}
