import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { OrderStatusValue } from "@/lib/orders";

const orderWithItems = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: { items: true },
});
export type OrderWithItems = Prisma.OrderGetPayload<typeof orderWithItems>;

const orderListItem = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: { _count: { select: { items: true } } },
});
export type OrderListItem = Prisma.OrderGetPayload<typeof orderListItem>;

/** Récupère une commande par sa référence lisible. */
export function getOrderByNumber(
  orderNumber: string,
): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });
}

export type OrdersQuery = {
  status?: OrderStatusValue;
  query?: string;
  page?: number;
  perPage?: number;
};

export type OrdersPage = {
  orders: OrderListItem[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
};

/** Liste des commandes filtrée (statut + recherche) et paginée. */
export async function getOrders({
  status,
  query,
  page = 1,
  perPage = 10,
}: OrdersQuery): Promise<OrdersPage> {
  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;

  const q = query?.trim();
  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }

  const safePage = Math.max(1, Math.floor(page));

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * perPage,
      take: perPage,
      include: { _count: { select: { items: true } } },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    total,
    page: safePage,
    perPage,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export type OrderStats = {
  totalOrders: number;
  revenueCents: number;
  counts: Record<OrderStatusValue, number>;
};

/** Indicateurs pour le tableau de bord. */
export async function getOrderStats(): Promise<OrderStats> {
  const [byStatus, revenue, totalOrders] = await Promise.all([
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.order.aggregate({
      _sum: { totalCents: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.count(),
  ]);

  const counts = {
    PENDING: 0,
    CONFIRMED: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  } as Record<OrderStatusValue, number>;
  for (const row of byStatus) {
    counts[row.status as OrderStatusValue] = row._count._all;
  }

  return {
    totalOrders,
    revenueCents: revenue._sum.totalCents ?? 0,
    counts,
  };
}
