"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  sendContactMessage,
  type ContactInput,
  type ContactFieldErrors,
} from "@/lib/actions/contact";

const EMPTY: ContactInput = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof ContactInput>(key: K, value: ContactInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    startTransition(async () => {
      const res = await sendContactMessage(form);
      if (res.ok) {
        setSent(true);
        setForm(EMPTY);
      } else {
        if (res.fieldErrors) setErrors(res.fieldErrors);
        if (res.error) setGlobalError(res.error);
      }
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/70 bg-cream-50 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bordeaux text-cream-100">
          <Check className="h-6 w-6" strokeWidth={1.7} />
        </span>
        <h2 className="font-serif text-xl text-bordeaux">Message envoyé</h2>
        <p className="max-w-sm text-sm text-bordeaux/65">
          Merci — nous revenons vers vous sous 48 h ouvrées.
        </p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom" error={errors.name}>
          <input
            className={inputCls(errors.name)}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
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
      </div>

      <Field label="Sujet (optionnel)">
        <input
          className={inputCls()}
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
        />
      </Field>

      <Field label="Message" error={errors.message}>
        <textarea
          rows={6}
          className={cn(inputCls(errors.message), "resize-none")}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </Field>

      {globalError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {globalError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Envoyer le message
      </Button>
    </form>
  );
}

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
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function inputCls(error?: string): string {
  return cn(
    "w-full rounded-lg border bg-cream-50 px-3.5 py-2.5 text-sm text-bordeaux outline-none transition-colors placeholder:text-bordeaux/35 focus:border-bordeaux",
    error ? "border-red-400" : "border-border/70",
  );
}
