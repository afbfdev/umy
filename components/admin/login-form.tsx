"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { signIn } from "@/lib/actions/auth";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Évite les redirections ouvertes : uniquement des chemins /admin internes.
  const target = next && next.startsWith("/admin") ? next : "/admin";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await signIn(email, password);
      if (res.ok) {
        router.replace(target);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-bordeaux/60">
          E-mail
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          autoFocus
          className="w-full rounded-lg border border-border/70 bg-cream-50 px-3.5 py-2.5 text-sm text-bordeaux outline-none transition-colors placeholder:text-bordeaux/35 focus:border-bordeaux"
          placeholder="admin@umy.dev"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-bordeaux/60">
          Mot de passe
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full rounded-lg border border-border/70 bg-cream-50 px-3.5 py-2.5 text-sm text-bordeaux outline-none transition-colors placeholder:text-bordeaux/35 focus:border-bordeaux"
          placeholder="••••••••"
        />
      </label>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-bordeaux px-4 py-3 text-sm font-medium text-cream-100 transition-colors hover:bg-bordeaux-900 disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Lock className="h-4 w-4" strokeWidth={1.7} />
        )}
        Se connecter
      </button>
    </form>
  );
}
