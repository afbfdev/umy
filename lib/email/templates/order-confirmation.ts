import { formatPrice } from "@/lib/utils";

export type OrderEmailData = {
  orderNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  addressLine2?: string | null;
  postalCode: string;
  city: string;
  country: string;
  items: {
    productName: string;
    variantName: string;
    quantity: number;
    lineTotalCents: number;
  }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
};

const CREAM = "#F4F1EA";
const CARD = "#FBFAF7";
const BORDEAUX = "#4A141C";
const MUTED = "#8A7B72";
const BORDER = "#E4DCCF";

export function renderOrderConfirmation(order: OrderEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Confirmation de votre commande ${order.orderNumber} — UMY`;

  const itemsRows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BORDER};color:${BORDEAUX};font-size:14px;">
          ${escapeHtml(i.productName)}
          <span style="color:${MUTED};"> · ${escapeHtml(i.variantName)} × ${i.quantity}</span>
        </td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid ${BORDER};color:${BORDEAUX};font-size:14px;white-space:nowrap;">
          ${formatPrice(i.lineTotalCents, order.currency)}
        </td>
      </tr>`,
    )
    .join("");

  const totalRow = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding:6px 0;color:${strong ? BORDEAUX : MUTED};font-size:${strong ? "16px" : "14px"};${strong ? "font-weight:600;" : ""}">${label}</td>
      <td align="right" style="padding:6px 0;color:${BORDEAUX};font-size:${strong ? "18px" : "14px"};${strong ? "font-weight:600;" : ""}">${value}</td>
    </tr>`;

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:${CREAM};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CARD};border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">
        <tr><td style="padding:32px 32px 8px;text-align:center;">
          <div style="font-size:26px;letter-spacing:6px;color:${BORDEAUX};">UMY</div>
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${MUTED};margin-top:4px;">Le concept store</div>
        </td></tr>

        <tr><td style="padding:16px 32px 0;">
          <h1 style="font-size:22px;color:${BORDEAUX};margin:16px 0 4px;">Merci ${escapeHtml(order.firstName)} !</h1>
          <p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${MUTED};line-height:1.6;margin:0;">
            Votre commande est confirmée. Référence
            <strong style="color:${BORDEAUX};">${order.orderNumber}</strong>.
          </p>
        </td></tr>

        <tr><td style="padding:20px 32px 0;">
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${BORDEAUX};background:#F0E4E0;border-radius:6px;padding:12px 14px;">
            💳 <strong>Paiement à la livraison</strong> — réglez
            ${formatPrice(order.totalCents, order.currency)} à la réception. Livraison sous 48 h.
          </div>
        </td></tr>

        <tr><td style="padding:24px 32px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;">
            ${itemsRows}
          </table>
        </td></tr>

        <tr><td style="padding:12px 32px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;">
            ${totalRow("Sous-total", formatPrice(order.subtotalCents, order.currency))}
            ${totalRow("Livraison", order.shippingCents === 0 ? "Offerte" : formatPrice(order.shippingCents, order.currency))}
            ${totalRow("Total", formatPrice(order.totalCents, order.currency), true)}
          </table>
        </td></tr>

        <tr><td style="padding:24px 32px 0;">
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};margin-bottom:6px;">Livraison</div>
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${BORDEAUX};line-height:1.6;">
            ${escapeHtml(order.firstName)} ${escapeHtml(order.lastName)}<br>
            ${escapeHtml(order.address)}${order.addressLine2 ? "<br>" + escapeHtml(order.addressLine2) : ""}<br>
            ${escapeHtml(order.postalCode)} ${escapeHtml(order.city)}<br>
            ${escapeHtml(order.country)}
          </div>
        </td></tr>

        <tr><td style="padding:28px 32px 32px;text-align:center;">
          <div style="border-top:1px solid ${BORDER};padding-top:20px;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${MUTED};">
            Une question ? Répondez simplement à cet e-mail.<br>
            © UMY — Le concept store
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `Merci ${order.firstName} !`,
    ``,
    `Votre commande ${order.orderNumber} est confirmée.`,
    `Paiement à la livraison : ${formatPrice(order.totalCents, order.currency)} à régler à la réception.`,
    ``,
    `Articles :`,
    ...order.items.map(
      (i) =>
        `- ${i.productName} · ${i.variantName} × ${i.quantity} : ${formatPrice(i.lineTotalCents, order.currency)}`,
    ),
    ``,
    `Sous-total : ${formatPrice(order.subtotalCents, order.currency)}`,
    `Livraison : ${order.shippingCents === 0 ? "Offerte" : formatPrice(order.shippingCents, order.currency)}`,
    `Total : ${formatPrice(order.totalCents, order.currency)}`,
    ``,
    `Livraison à :`,
    `${order.firstName} ${order.lastName}`,
    `${order.address}${order.addressLine2 ? ", " + order.addressLine2 : ""}`,
    `${order.postalCode} ${order.city}, ${order.country}`,
    ``,
    `© UMY — Le concept store`,
  ].join("\n");

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
