import { PrismaClient, type OrderStatus } from "@prisma/client";
import { computeShippingCents } from "../lib/shipping";

const prisma = new PrismaClient();

type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  notes?: string;
};

const CUSTOMERS: { c: Customer; status: OrderStatus; skus: [string, number][]; date: string }[] = [
  {
    c: { firstName: "Camille", lastName: "Durand", email: "camille.durand@example.com", phone: "0612345678", address: "12 rue des Parfums", postalCode: "75002", city: "Paris", notes: "Sonner à l'interphone" },
    status: "PENDING",
    skus: [["UMY-SA-50", 1], ["UMY-RV-BOR", 2]],
    date: "2026-07-20T10:15:00Z",
  },
  {
    c: { firstName: "Léa", lastName: "Martin", email: "lea.martin@example.com", phone: "0623456789", address: "48 avenue Botanique", postalCode: "69003", city: "Lyon" },
    status: "CONFIRMED",
    skus: [["UMY-NB-100", 1]],
    date: "2026-07-19T16:40:00Z",
  },
  {
    c: { firstName: "Yasmine", lastName: "Benali", email: "yasmine.benali@example.com", phone: "0634567890", address: "3 impasse des Roses", postalCode: "33000", city: "Bordeaux" },
    status: "SHIPPED",
    skus: [["UMY-ON-50", 1], ["UMY-SEB-30", 1]],
    date: "2026-07-17T09:05:00Z",
  },
  {
    c: { firstName: "Thomas", lastName: "Petit", email: "thomas.petit@example.com", phone: "0645678901", address: "27 boulevard Haussmann", postalCode: "13006", city: "Marseille" },
    status: "DELIVERED",
    skus: [["UMY-CDP-3", 1]],
    date: "2026-07-12T14:22:00Z",
  },
  {
    c: { firstName: "Chloé", lastName: "Moreau", email: "chloe.moreau@example.com", phone: "0656789012", address: "9 rue Nationale", postalCode: "59000", city: "Lille" },
    status: "DELIVERED",
    skus: [["UMY-HPC-100", 2], ["UMY-PLN-12", 1]],
    date: "2026-07-10T11:48:00Z",
  },
  {
    c: { firstName: "Inès", lastName: "Rousseau", email: "ines.rousseau@example.com", phone: "0667890123", address: "5 place Bellecour", postalCode: "44000", city: "Nantes" },
    status: "CANCELLED",
    skus: [["UMY-SA-100", 1]],
    date: "2026-07-08T18:30:00Z",
  },
];

async function main() {
  console.log("🌱 Seed commandes de démonstration");
  await prisma.order.deleteMany();

  const variants = await prisma.productVariant.findMany({ include: { product: true } });
  const bySku = new Map(variants.map((v) => [v.sku, v]));

  let n = 0;
  for (const entry of CUSTOMERS) {
    n += 1;
    const items = entry.skus.map(([sku, qty]) => {
      const v = bySku.get(sku);
      if (!v) throw new Error(`SKU introuvable: ${sku} (relancez d'abord: npm run db:seed)`);
      return {
        variantId: v.id,
        productId: v.productId,
        productName: v.product.name,
        variantName: v.name,
        unitPriceCents: v.priceCents,
        quantity: qty,
        lineTotalCents: v.priceCents * qty,
      };
    });
    const subtotalCents = items.reduce((s, i) => s + i.lineTotalCents, 0);
    const shippingCents = computeShippingCents(subtotalCents);

    await prisma.order.create({
      data: {
        orderNumber: `UMY-DEMO${String(n).padStart(2, "0")}`,
        status: entry.status,
        paymentMethod: "CASH_ON_DELIVERY",
        email: entry.c.email,
        firstName: entry.c.firstName,
        lastName: entry.c.lastName,
        phone: entry.c.phone,
        address: entry.c.address,
        postalCode: entry.c.postalCode,
        city: entry.c.city,
        country: "France",
        notes: entry.c.notes ?? null,
        subtotalCents,
        shippingCents,
        totalCents: subtotalCents + shippingCents,
        currency: "EUR",
        createdAt: new Date(entry.date),
        items: { create: items },
      },
    });
  }

  const total = await prisma.order.count();
  console.log(`✅ ${total} commandes créées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
