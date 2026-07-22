export type CheckoutItemInput = {
  variantId: string;
  quantity: number;
};

export type CheckoutCustomerInput = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  country: string;
  notes?: string;
};

export type PlaceOrderInput = CheckoutCustomerInput & {
  items: CheckoutItemInput[];
};

export type FieldErrors = Partial<Record<keyof CheckoutCustomerInput, string>>;

export type PlaceOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

/**
 * Validation des coordonnées client — pure, sans dépendance serveur, donc
 * réutilisable pour le retour immédiat côté formulaire ET l'autorité serveur.
 */
export function validateCustomer(input: Partial<CheckoutCustomerInput>): FieldErrors {
  const errors: FieldErrors = {};
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!input.firstName?.trim()) errors.firstName = "Prénom requis";
  if (!input.lastName?.trim()) errors.lastName = "Nom requis";
  if (!input.email?.trim() || !emailRe.test(input.email.trim()))
    errors.email = "E-mail invalide";
  if (!input.phone?.trim() || input.phone.replace(/\D/g, "").length < 8)
    errors.phone = "Téléphone invalide";
  if (!input.address?.trim()) errors.address = "Adresse requise";
  if (!input.postalCode?.trim()) errors.postalCode = "Code postal requis";
  if (!input.city?.trim()) errors.city = "Ville requise";

  return errors;
}
