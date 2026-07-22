"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { useScrolled } from "@/hooks/use-scroll-position";
import { CartIconButton } from "@/components/cart/cart-icon-button";
import { CartSheet } from "@/components/cart/cart-sheet";
import { Logo } from "@/components/brand/logo";
import { NavSearch } from "@/components/search/nav-search";
import { CurrencySwitcher } from "@/components/currency/currency-switcher";

export function Navbar() {
  const scrolled = useScrolled(24);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "border-b border-border/60 bg-cream-100/80 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between md:h-20">
        {/* Liens — masqués sur mobile */}
        <nav className="hidden flex-1 items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-xs uppercase tracking-[0.18em] text-bordeaux/80 transition-colors hover:text-bordeaux"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logotype central */}
        <Link
          href="/"
          className="text-bordeaux"
          aria-label={`${siteConfig.name} — accueil`}
        >
          <Logo className="h-6 w-auto md:h-7" />
        </Link>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-4 text-bordeaux md:gap-6">
          <NavSearch />
          <CurrencySwitcher />
          <button aria-label="Mon compte" className="hidden transition-opacity hover:opacity-60 sm:block">
            <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
          </button>
          <CartIconButton />
        </div>
      </div>

      {/* Tiroir panier (monté une seule fois) */}
      <CartSheet />
    </header>
  );
}
