export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

export type StatusTone = "amber" | "blue" | "violet" | "green" | "red";

export const ORDER_STATUS_META: Record<
  OrderStatusValue,
  { label: string; tone: StatusTone }
> = {
  PENDING: { label: "En attente", tone: "amber" },
  CONFIRMED: { label: "Confirmée", tone: "blue" },
  SHIPPED: { label: "Expédiée", tone: "violet" },
  DELIVERED: { label: "Livrée", tone: "green" },
  CANCELLED: { label: "Annulée", tone: "red" },
};

/** Transitions autorisées depuis chaque statut (les états finaux n'en ont pas). */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

export function isOrderStatus(value: string): value is OrderStatusValue {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}
