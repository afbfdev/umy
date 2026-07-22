"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_META,
  ORDER_STATUS_TRANSITIONS,
  type OrderStatusValue,
} from "@/lib/orders";
import { updateOrderStatus } from "@/app/admin/actions";

export function OrderStatusForm({
  orderNumber,
  status,
}: {
  orderNumber: string;
  status: OrderStatusValue;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const transitions = ORDER_STATUS_TRANSITIONS[status];

  function apply(next: OrderStatusValue) {
    setError(null);
    startTransition(async () => {
      const res = await updateOrderStatus(orderNumber, next);
      if (res.ok) {
        setConfirmCancel(false);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  if (transitions.length === 0) {
    return (
      <p className="text-sm text-bordeaux/55">
        Cette commande est dans un état final — aucune action disponible.
      </p>
    );
  }

  const advanceTargets = transitions.filter((t) => t !== "CANCELLED");
  const canCancel = transitions.includes("CANCELLED");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {advanceTargets.map((next) => (
          <button
            key={next}
            type="button"
            disabled={pending}
            onClick={() => apply(next)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg bg-bordeaux px-4 py-2.5 text-sm font-medium text-cream-100 transition-colors hover:bg-bordeaux-900 disabled:opacity-50",
            )}
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Marquer « {ORDER_STATUS_META[next].label} »
          </button>
        ))}
      </div>

      {canCancel && (
        <div className="border-t border-border/60 pt-4">
          {confirmCancel ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-bordeaux">
                Annuler cette commande ? Le stock sera restitué.
              </span>
              <button
                type="button"
                disabled={pending}
                onClick={() => apply("CANCELLED")}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirmer l'annulation
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => setConfirmCancel(false)}
                className="text-sm text-bordeaux/60 hover:text-bordeaux"
              >
                Retour
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={pending}
              onClick={() => setConfirmCancel(true)}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              Annuler la commande
            </button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
