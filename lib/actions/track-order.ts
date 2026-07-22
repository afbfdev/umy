"use server";

import { getOrderByNumber } from "@/lib/data/orders";
import { formatDateTime } from "@/lib/utils";
import type { OrderStatusValue } from "@/lib/orders";

export type TrackedOrder = {
  orderNumber: string;
  firstName: string;
  status: OrderStatusValue;
  placedAt: string;
  totalCents: number;
  shippingCents: number;
  subtotalCents: number;
  currency: string;
  city: string;
  items: {
    productName: string;
    variantName: string;
    quantity: number;
    lineTotalCents: number;
  }[];
};

export type TrackResult =
  | { ok: true; order: TrackedOrder }
  | { ok: false; error: string };

export async function trackOrder(
  orderNumber: string,
  email: string,
): Promise<TrackResult> {
  const ref = orderNumber?.trim().toUpperCase();
  const mail = email?.trim().toLowerCase();
  if (!ref || !mail) {
    return { ok: false, error: "Référence et e-mail requis." };
  }

  const order = await getOrderByNumber(ref);
  // Message générique : on ne révèle pas si la référence existe.
  const generic = {
    ok: false as const,
    error: "Aucune commande ne correspond à ces informations.",
  };
  if (!order || order.email.toLowerCase() !== mail) {
    return generic;
  }

  return {
    ok: true,
    order: {
      orderNumber: order.orderNumber,
      firstName: order.firstName,
      status: order.status as OrderStatusValue,
      placedAt: formatDateTime(order.createdAt),
      totalCents: order.totalCents,
      shippingCents: order.shippingCents,
      subtotalCents: order.subtotalCents,
      currency: order.currency,
      city: order.city,
      items: order.items.map((i) => ({
        productName: i.productName,
        variantName: i.variantName,
        quantity: i.quantity,
        lineTotalCents: i.lineTotalCents,
      })),
    },
  };
}
