"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions/admin-categories";

export function CategoryDeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function remove() {
    setError(null);
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.ok) {
        setConfirming(false);
        router.refresh();
      } else {
        setError(res.error ?? "Suppression impossible.");
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {pending && <Loader2 className="h-3 w-3 animate-spin" />}
          Confirmer
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-xs text-bordeaux/50 hover:text-bordeaux"
        >
          Annuler
        </button>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        aria-label={`Supprimer ${name}`}
        onClick={() => setConfirming(true)}
        className="text-bordeaux/40 transition-colors hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.6} />
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
