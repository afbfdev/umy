"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  ORDER_STATUS_TRANSITIONS,
  isOrderStatus,
  type OrderStatusValue,
} from "@/lib/orders";

export type UpdateStatusResult =
  | { ok: true; status: OrderStatusValue }
  | { ok: false; error: string };

export async function updateOrderStatus(
  orderNumber: string,
  next: string,
): Promise<UpdateStatusResult> {
  if (!isOrderStatus(next)) {
    return { ok: false, error: "Statut inconnu." };
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) {
    return { ok: false, error: "Commande introuvable." };
  }

  const current = order.status as OrderStatusValue;
  if (current === next) {
    return { ok: true, status: current };
  }
  if (!ORDER_STATUS_TRANSITIONS[current].includes(next)) {
    return { ok: false, error: "Cette transition de statut n'est pas autorisée." };
  }

  await prisma.$transaction(async (tx) => {
    // Annulation → on restitue le stock des articles encore rattachés à une variante
    if (next === "CANCELLED") {
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.updateMany({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
        // Maintien du stock dénormalisé produit (updateMany = pas d'erreur si supprimé).
        if (item.productId) {
          await tx.product.updateMany({
            where: { id: item.productId },
            data: { stockTotal: { increment: item.quantity } },
          });
        }
      }
    }
    await tx.order.update({
      where: { id: order.id },
      data: { status: next },
    });
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);

  return { ok: true, status: next };
}
