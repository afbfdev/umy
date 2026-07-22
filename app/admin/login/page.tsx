import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/current-admin";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  // Déjà connecté → vers le tableau de bord.
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo className="mx-auto h-12 w-auto text-bordeaux" />
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-bordeaux/50">
            Espace administrateur
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-cream-50 p-7 shadow-sm">
          <h1 className="mb-6 font-serif text-xl text-bordeaux">Connexion</h1>
          <LoginForm next={searchParams.next} />
        </div>

        {isDev && (
          <p className="mt-4 text-center text-xs text-bordeaux/45">
            Dev : <span className="text-bordeaux/60">admin@umy.dev</span> ·{" "}
            <span className="text-bordeaux/60">umy-admin-2026</span>
          </p>
        )}
      </div>
    </div>
  );
}
