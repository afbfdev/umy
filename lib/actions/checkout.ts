"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { computeShippingCents } from "@/lib/shipping";
import {
  validateCustomer,
  type PlaceOrderInput,
  type PlaceOrderResult,
} from "@/lib/checkout";
import { sendEmail } from "@/lib/email/send";
import { renderOrderConfirmation } from "@/lib/email/templates/order-confirmation";

/** Référence lisible, ex. UMY-LX9K2P (timestamp + aléa en base 36). */
function generateOrderNumber(): string {
  const t = Date.now().toString(36).toUpperCase().slice(-4);
  const r = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `UMY-${t}${r}`;
}

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  // 1. Coordonnées valides
  const fieldErrors = validateCustomer(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Veuillez corriger les champs signalés.", fieldErrors };
  }

  // 2. Panier non vide
  const cleanItems = (input.items ?? []).filter(
    (i) => i.variantId && i.quantity > 0,
  );
  if (cleanItems.length === 0) {
    return { ok: false, error: "Votre panier est vide." };
  }

  // 3. Données autoritatives depuis la base (jamais les prix du client)
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: cleanItems.map((i) => i.variantId) } },
    include: { product: true },
  });
  const variantMap = new Map(variants.map((v) => [v.id, v]));

  const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];
  const stockUpdates: {
    variantId: string;
    productId: string;
    quantity: number;
  }[] = [];
  let subtotalCents = 0;
  for (const item of cleanItems) {
    const v = variantMap.get(item.variantId);
    if (!v) {
      return { ok: false, error: "Un article de votre panier n'est plus disponible." };
    }
    const qty = Math.floor(item.quantity);
    if (v.stock < qty) {
      return {
        ok: false,
        error: `Stock insuffisant pour « ${v.product.name} — ${v.name} ».`,
      };
    }
    const lineTotalCents = v.priceCents * qty;
    subtotalCents += lineTotalCents;
    orderItems.push({
      variantId: v.id,
      productId: v.productId,
      productName: v.product.name,
      variantName: v.name,
      unitPriceCents: v.priceCents,
      quantity: qty,
      lineTotalCents,
    });
    stockUpdates.push({ variantId: v.id, productId: v.productId, quantity: qty });
  }

  const shippingCents = computeShippingCents(subtotalCents);
  const totalCents = subtotalCents + shippingCents;
  const currency = variants[0]?.currency ?? "EUR";

  // 4. Décrément de stock atomique + création de la commande, en transaction
  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const upd of stockUpdates) {
        const updated = await tx.productVariant.updateMany({
          where: { id: upd.variantId, stock: { gte: upd.quantity } },
          data: { stock: { decrement: upd.quantity } },
        });
        if (updated.count === 0) {
          throw new Error("OUT_OF_STOCK");
        }
        // Maintien du stock dénormalisé au niveau produit.
        await tx.product.update({
          where: { id: upd.productId },
          data: { stockTotal: { decrement: upd.quantity } },
        });
      }

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          status: "PENDING",
          paymentMethod: "CASH_ON_DELIVERY",
          email: input.email.trim(),
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          phone: input.phone.trim(),
          address: input.address.trim(),
          addressLine2: input.addressLine2?.trim() || null,
          postalCode: input.postalCode.trim(),
          city: input.city.trim(),
          country: input.country?.trim() || "France",
          notes: input.notes?.trim() || null,
          subtotalCents,
          shippingCents,
          totalCents,
          currency,
          items: { create: orderItems },
        },
      });
    });

    // E-mail de confirmation — best-effort, ne bloque jamais la commande.
    try {
      const email = renderOrderConfirmation({
        orderNumber: order.orderNumber,
        firstName: order.firstName,
        lastName: order.lastName,
        address: order.address,
        addressLine2: order.addressLine2,
        postalCode: order.postalCode,
        city: order.city,
        country: order.country,
        items: orderItems.map((i) => ({
          productName: i.productName,
          variantName: i.variantName,
          quantity: i.quantity,
          lineTotalCents: i.lineTotalCents,
        })),
        subtotalCents,
        shippingCents,
        totalCents,
        currency,
      });
      const sent = await sendEmail({
        to: order.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
      if (!sent.ok) console.error("[placeOrder] e-mail non envoyé:", sent.error);
    } catch (mailErr) {
      console.error("[placeOrder] erreur e-mail:", mailErr);
    }

    return { ok: true, orderNumber: order.orderNumber };
  } catch (e) {
    if (e instanceof Error && e.message === "OUT_OF_STOCK") {
      return {
        ok: false,
        error: "Le stock d'un article vient de changer. Vérifiez votre panier.",
      };
    }
    console.error("[placeOrder]", e);
    return {
      ok: false,
      error: "Une erreur est survenue lors de la création de la commande.",
    };
  }
}
