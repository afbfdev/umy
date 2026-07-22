"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Truck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Price } from "@/components/currency/price";
import { useCurrency } from "@/components/currency/currency-provider";
import { Button } from "@/components/ui/button";
import { useCart, selectSubtotalCents } from "@/lib/store/cart";
import { useMounted } from "@/hooks/use-mounted";
import { computeShippingCents } from "@/lib/shipping";
import {
  validateCustomer,
  type CheckoutCustomerInput,
  type FieldErrors,
} from "@/lib/checkout";
import { placeOrder } from "@/lib/actions/checkout";

const EMPTY: CheckoutCustomerInput = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  addressLine2: "",
  postalCode: "",
  city: "",
  country: "France",
  notes: "",
};

export function CheckoutForm() {
  const mounted = useMounted();
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotalCents);
  const clear = useCart((s) => s.clear);

  const [form, setForm] = useState<CheckoutCustomerInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const shipping = computeShippingCents(subtotal);
  const total = subtotal + shipping;
  const { code } = useCurrency();

  function set<K extends keyof CheckoutCustomerInput>(
    key: K,
    value: CheckoutCustomerInput[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);

    const fieldErrors = validateCustomer(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await placeOrder({
        ...form,
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      });

      if (result.ok) {
        clear();
        router.push(`/commande/confirmation/${result.orderNumber}`);
      } else {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setGlobalError(result.error);
      }
    });
  }

  // Anti-flash pendant l'hydratation du panier
  if (!mounted) return <div className="min-h-[40vh]" aria-hidden />;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-5 text-center">
        <h2 className="font-serif text-2xl text-bordeaux">Votre panier est vide</h2>
        <p className="max-w-sm text-bordeaux/60">
          Ajoutez des articles avant de passer commande.
        </p>
        <Button asChild size="lg">
          <Link href="/categories">Découvrir la maison</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-12 lg:grid-cols-[1.5fr_1fr]"
      noValidate
    >
      {/* Coordonnées + livraison */}
      <div className="space-y-10">
        <fieldset className="space-y-5" disabled={pending}>
          <legend className="eyebrow mb-4">Coordonnées</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Prénom" error={errors.firstName}>
              <input
                className={inputCls(errors.firstName)}
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                autoComplete="given-name"
              />
            </Field>
            <Field label="Nom" error={errors.lastName}>
              <input
                className={inputCls(errors.lastName)}
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                autoComplete="family-name"
              />
            </Field>
            <Field label="E-mail" error={errors.email}>
              <input
                type="email"
                className={inputCls(errors.email)}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="Téléphone" error={errors.phone}>
              <input
                type="tel"
                className={inputCls(errors.phone)}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                autoComplete="tel"
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-5" disabled={pending}>
          <legend className="eyebrow mb-4">Adresse de livraison</legend>
          <Field label="Adresse" error={errors.address}>
            <input
              className={inputCls(errors.address)}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              autoComplete="address-line1"
            />
          </Field>
          <Field label="Complément (optionnel)">
            <input
              className={inputCls()}
              value={form.addressLine2}
              onChange={(e) => set("addressLine2", e.target.value)}
              autoComplete="address-line2"
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-[1fr_2fr]">
            <Field label="Code postal" error={errors.postalCode}>
              <input
                className={inputCls(errors.postalCode)}
                value={form.postalCode}
                onChange={(e) => set("postalCode", e.target.value)}
                autoComplete="postal-code"
              />
            </Field>
            <Field label="Ville" error={errors.city}>
              <input
                className={inputCls(errors.city)}
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                autoComplete="address-level2"
              />
            </Field>
          </div>
          <Field label="Pays">
            <input
              className={inputCls()}
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              autoComplete="country-name"
            />
          </Field>
          <Field label="Instructions de livraison (optionnel)">
            <textarea
              rows={3}
              className={cn(inputCls(), "resize-none")}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </fieldset>

        {/* Mode de paiement */}
        <fieldset>
          <legend className="eyebrow mb-4">Paiement</legend>
          <div className="flex items-start gap-3 rounded-[3px] border border-bordeaux/30 bg-nude/15 p-4">
            <Truck className="mt-0.5 h-5 w-5 text-bordeaux" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-bordeaux">
                Paiement à la livraison
              </p>
              <p className="mt-1 text-xs text-bordeaux/60">
                Vous réglez en espèces ou par carte à la réception de votre commande.
              </p>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Récapitulatif */}
      <aside className="h-fit rounded-[3px] border border-border/60 bg-cream-50 p-7 lg:sticky lg:top-28">
        <h2 className="font-serif text-xl text-bordeaux">Votre commande</h2>

        <ul className="mt-5 space-y-3 border-b border-border/60 pb-5">
          {items.map((i) => (
            <li key={i.variantId} className="flex justify-between gap-3 text-sm">
              <span className="text-bordeaux/75">
                {i.productName}
                <span className="text-bordeaux/45">
                  {" "}
                  · {i.variantName} × {i.quantity}
                </span>
              </span>
              <Price
                cents={i.priceCents * i.quantity}
                className="whitespace-nowrap text-bordeaux"
              />
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between text-bordeaux/70">
            <dt>Sous-total</dt>
            <dd>
              <Price cents={subtotal} />
            </dd>
          </div>
          <div className="flex justify-between text-bordeaux/70">
            <dt>Livraison</dt>
            <dd>{shipping === 0 ? "Offerte" : <Price cents={shipping} />}</dd>
          </div>
          <div className="flex justify-between border-t border-border/60 pt-3 text-bordeaux">
            <dt className="font-medium">Total</dt>
            <dd className="font-serif text-lg">
              <Price cents={total} />
            </dd>
          </div>
        </dl>

        {code !== "EUR" && (
          <p className="mt-3 text-xs text-bordeaux/45">
            Montants convertis depuis l'euro à titre indicatif ; commande réglée à
            la livraison.
          </p>
        )}

        {globalError && (
          <p className="mt-5 rounded-[2px] border border-bordeaux/30 bg-bordeaux/5 px-3 py-2 text-sm text-bordeaux">
            {globalError}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Traitement…
            </>
          ) : (
            "Confirmer la commande"
          )}
        </Button>
        <p className="mt-3 text-center text-xs text-bordeaux/45">
          En confirmant, vous acceptez nos conditions de vente.
        </p>
      </aside>
    </form>
  );
}

/* ── Sous-composants de champ ─────────────────────────────────── */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-bordeaux/60">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-bordeaux">{error}</span>}
    </label>
  );
}

function inputCls(error?: string): string {
  return cn(
    "w-full rounded-[2px] border bg-cream-50 px-3.5 py-2.5 text-sm text-bordeaux outline-none transition-colors placeholder:text-bordeaux/35 focus:border-bordeaux",
    error ? "border-bordeaux" : "border-border/70",
  );
}
