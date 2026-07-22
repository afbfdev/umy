"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage } from "@/lib/client/upload";

export function ImageUploader({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-bordeaux/60">
        {label}
      </span>

      <div className="flex items-center gap-4">
        {/* Aperçu */}
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-cream-100">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label="Retirer l'image"
                onClick={() => onChange("")}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-bordeaux/80 text-cream-100 hover:bg-bordeaux"
              >
                <X className="h-3 w-3" strokeWidth={2} />
              </button>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-bordeaux/25">
              <ImagePlus className="h-6 w-6" strokeWidth={1.4} />
            </div>
          )}
        </div>

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-border/70 px-3.5 py-2 text-sm text-bordeaux transition-colors hover:border-bordeaux/50 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" strokeWidth={1.6} />
            )}
            {value ? "Remplacer" : "Choisir une image"}
          </button>
          <p className="mt-1.5 text-xs text-bordeaux/40">PNG, JPG, WebP · max 5 Mo</p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
