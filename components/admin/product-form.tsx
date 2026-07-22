"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import {
  createProduct,
  updateProduct,
  type ProductInput,
  type VariantInput,
} from "@/lib/actions/admin-products";
import { ImageUploader } from "@/components/admin/image-uploader";
import { GalleryUploader } from "@/components/admin/gallery-uploader";

type Row = {
  key: number;
  id?: string;
  name: string;
  sku: string;
  volume: string;
  price: string; // en euros
  stock: string;
  isDefault: boolean;
};

type InitialProduct = {
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
  variants: {
    id: string;
    name: string;
    sku: string;
    volumeMl: number | null;
    priceCents: number;
    stock: number;
    isDefault: boolean;
  }[];
};

export function ProductForm({
  id,
  categories,
  initial,
}: {
  id?: string;
  categories: { id: string; name: string }[];
  initial?: InitialProduct;
}) {
  const keyRef = useRef(0);
  const nextKey = () => (keyRef.current += 1);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    tagline: initial?.tagline ?? "",
    description: initial?.description ?? "",
    family: initial?.family ?? "",
    imageUrl: initial?.imageUrl ?? "",
    gallery: initial?.gallery ?? [],
    isActive: initial?.isActive ?? true,
    isFeatured: initial?.isFeatured ?? false,
  });

  const [rows, setRows] = useState<Row[]>(
    initial?.variants.map((v) => ({
      key: nextKey(),
      id: v.id,
      name: v.name,
      sku: v.sku,
      volume: v.volumeMl?.toString() ?? "",
      price: (v.priceCents / 100).toFixed(2),
      stock: v.stock.toString(),
      isDefault: v.isDefault,
    })) ?? [
      { key: nextKey(), name: "", sku: "", volume: "", price: "", stock: "0", isDefault: true },
    ],
  );

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setRow(key: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((rs) => [
      ...rs,
      { key: nextKey(), name: "", sku: "", volume: "", price: "", stock: "0", isDefault: rs.length === 0 },
    ]);
  }
  function removeRow(key: number) {
    setRows((rs) => rs.filter((r) => r.key !== key));
  }
  function setDefault(key: number) {
    setRows((rs) => rs.map((r) => ({ ...r, isDefault: r.key === key })));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const variants: VariantInput[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      sku: r.sku,
      volumeMl: r.volume.trim() ? parseInt(r.volume, 10) : null,
      priceCents: Math.round(parseFloat(r.price.replace(",", ".")) * 100) || 0,
      stock: parseInt(r.stock, 10) || 0,
      isDefault: r.isDefault,
    }));

    const payload: ProductInput = { ...form, variants };

    startTransition(async () => {
      const res = id ? await updateProduct(id, payload) : await createProduct(payload);
      if (res && !res.ok) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Informations */}
      <section className="max-w-3xl space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nom">
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => {
                if (!form.slug.trim() && form.name.trim())
                  setField("slug", slugify(form.name));
              }}
            />
          </Field>
          <Field label="Slug (URL)" hint="vide = généré">
            <input
              className={inputCls}
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              placeholder={form.name ? slugify(form.name) : "ex. oud-nocturne"}
            />
          </Field>
          <Field label="Catégorie">
            <select
              className={inputCls}
              value={form.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Famille" hint="ex. Boisé, Visage…">
            <input
              className={inputCls}
              value={form.family}
              onChange={(e) => setField("family", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Accroche (tagline)">
          <input
            className={inputCls}
            value={form.tagline}
            onChange={(e) => setField("tagline", e.target.value)}
          />
        </Field>
        <Field label="Description">
          <textarea
            rows={3}
            className={cn(inputCls, "resize-none")}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </Field>

        <ImageUploader
          label="Image principale"
          value={form.imageUrl}
          onChange={(url) => setField("imageUrl", url)}
        />

        <GalleryUploader
          value={form.gallery}
          onChange={(urls) => setField("gallery", urls)}
        />

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setField("isActive", e.target.checked)}
              className="h-4 w-4 accent-[#4A141C]"
            />
            <span className="text-sm text-bordeaux">Actif (visible en boutique)</span>
          </label>
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setField("isFeatured", e.target.checked)}
              className="h-4 w-4 accent-[#4A141C]"
            />
            <span className="text-sm text-bordeaux">Mis en avant</span>
          </label>
        </div>
      </section>

      {/* Déclinaisons */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-bordeaux">
            Déclinaisons &amp; stock
          </h2>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 px-3 py-1.5 text-sm text-bordeaux transition-colors hover:border-bordeaux/50"
          >
            <Plus className="h-4 w-4" strokeWidth={1.7} />
            Ajouter
          </button>
        </div>

        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.key}
              className="grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-cream-50 p-4 md:grid-cols-[2fr_1.4fr_0.8fr_1fr_0.8fr_auto]"
            >
              <MiniField label="Nom">
                <input className={miniCls} value={r.name} onChange={(e) => setRow(r.key, { name: e.target.value })} placeholder="Eau de Parfum · 50 ml" />
              </MiniField>
              <MiniField label="SKU">
                <input className={miniCls} value={r.sku} onChange={(e) => setRow(r.key, { sku: e.target.value })} placeholder="UMY-XX-50" />
              </MiniField>
              <MiniField label="Vol. (ml)">
                <input className={miniCls} inputMode="numeric" value={r.volume} onChange={(e) => setRow(r.key, { volume: e.target.value })} placeholder="50" />
              </MiniField>
              <MiniField label="Prix (€)">
                <input className={miniCls} inputMode="decimal" value={r.price} onChange={(e) => setRow(r.key, { price: e.target.value })} placeholder="129.00" />
              </MiniField>
              <MiniField label="Stock">
                <input className={miniCls} inputMode="numeric" value={r.stock} onChange={(e) => setRow(r.key, { stock: e.target.value })} placeholder="0" />
              </MiniField>
              <div className="col-span-2 flex items-end justify-between gap-3 md:col-span-1 md:flex-col md:items-center md:justify-center">
                <label className="flex items-center gap-1.5 text-xs text-bordeaux/70">
                  <input
                    type="radio"
                    name="defaultVariant"
                    checked={r.isDefault}
                    onChange={() => setDefault(r.key)}
                    className="h-3.5 w-3.5 accent-[#4A141C]"
                  />
                  Défaut
                </label>
                <button
                  type="button"
                  aria-label="Supprimer la déclinaison"
                  onClick={() => removeRow(r.key)}
                  disabled={rows.length <= 1}
                  className="text-bordeaux/40 transition-colors hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <p className="max-w-3xl rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-border/60 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-bordeaux px-5 py-2.5 text-sm font-medium text-cream-100 transition-colors hover:bg-bordeaux-900 disabled:opacity-50"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {id ? "Enregistrer" : "Créer le produit"}
        </button>
        <Link href="/admin/products" className="text-sm text-bordeaux/60 hover:text-bordeaux">
          Annuler
        </Link>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-border/70 bg-cream-50 px-3.5 py-2.5 text-sm text-bordeaux outline-none transition-colors placeholder:text-bordeaux/35 focus:border-bordeaux";
const miniCls =
  "w-full rounded-md border border-border/70 bg-white px-2.5 py-2 text-sm text-bordeaux outline-none transition-colors placeholder:text-bordeaux/30 focus:border-bordeaux";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
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
    </label>
  );
}

function MiniField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[0.65rem] uppercase tracking-[0.1em] text-bordeaux/45">
        {label}
      </span>
      {children}
    </label>
  );
}
