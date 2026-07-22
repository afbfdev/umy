import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusionne des classes Tailwind sans conflits (utilisé par Shadcn UI). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formate un prix stocké en centimes vers une devise lisible. */
export function formatPrice(
  cents: number,
  currency: string = "EUR",
  locale: string = "fr-FR",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/** Transforme un texte en slug URL (sans accents, minuscules, tirets). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Date courte, ex. « 21 juil. 2026 ». */
export function formatDate(date: Date | string, locale: string = "fr-FR") {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Date + heure, ex. « 21 juil. 2026, 14:32 ». */
export function formatDateTime(date: Date | string, locale: string = "fr-FR") {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
