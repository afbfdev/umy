"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Store,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";
import { Logo } from "@/components/brand/logo";

const NAV = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Commandes", href: "/admin/orders", icon: Package, exact: false },
  { label: "Produits", href: "/admin/products", icon: Tag, exact: false },
  { label: "Catégories", href: "/admin/categories", icon: FolderTree, exact: false },
];

export function AdminShell({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: { name: string; email: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-bordeaux text-cream-100"
                : "text-bordeaux/70 hover:bg-nude/30 hover:text-bordeaux",
            )}
          >
            <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.6} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-2 space-y-1 border-t border-border/60 pt-3">
      <Link
        href="/"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-bordeaux/60 transition-colors hover:bg-nude/30 hover:text-bordeaux"
      >
        <Store className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.6} />
        Retour à la boutique
      </Link>

      <div className="rounded-lg px-3 py-2">
        <p className="truncate text-sm font-medium text-bordeaux">{admin.name}</p>
        <p className="truncate text-xs text-bordeaux/50">{admin.email}</p>
      </div>

      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-bordeaux/70 transition-colors hover:bg-nude/30 hover:text-bordeaux"
        >
          <LogOut className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.6} />
          Se déconnecter
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-dvh bg-cream-100 lg:grid lg:grid-cols-[264px_1fr]">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border/60 bg-cream-50 p-5 lg:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-2.5 px-2 text-bordeaux">
          <Logo className="h-6 w-auto" />
          <span className="text-[0.6rem] uppercase tracking-[0.18em] text-bordeaux/50">
            Admin
          </span>
        </Link>
        {nav}
        {footer}
      </aside>

      {/* Barre mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-cream-50/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 text-bordeaux">
          <Logo className="h-5 w-auto" />
          <span className="text-[0.55rem] uppercase tracking-[0.18em] text-bordeaux/50">
            Admin
          </span>
        </Link>
        <button
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen(true)}
          className="text-bordeaux"
        >
          <Menu className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </header>

      {/* Tiroir mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-bordeaux/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[80%] flex-col border-r border-border/60 bg-cream-50 p-5">
            <div className="mb-8 flex items-center justify-between px-2">
              <Logo className="h-6 w-auto text-bordeaux" />
              <button
                type="button"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
                className="text-bordeaux/60"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            {nav}
            {footer}
          </aside>
        </div>
      )}

      {/* Contenu */}
      <div className="min-w-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
