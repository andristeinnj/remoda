import Link from "next/link";
import { Search, User } from "lucide-react";
import { CartButton } from "@/components/cart/cart-button";
import { CATEGORIES } from "@/lib/catalog";

const primaryNav = [
  { label: "Konur", href: "/konur" },
  { label: "Karlar", href: "/karlar" },
  { label: "Nýjar vörur", href: "/leit?sort=newest" },
  { label: "Útsala", href: "/leit?sale=1" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      {/* Announcement bar */}
      <div className="bg-lavender-purple-600 text-center text-xs font-medium text-white">
        <div className="mx-auto max-w-7xl px-4 py-2">
          Frí heimsending með Dropp yfir 15.000 kr · Sjálfbær tíska úr fataskápum Íslands
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
        <Link href="/" className="shrink-0">
          <span className="font-display text-2xl font-semibold tracking-tight">
            Re<span className="text-accent">Moda</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-7 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/leit"
            aria-label="Leita"
            className="inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
          >
            <Search className="size-5" />
          </Link>
          <Link
            href="/minar-sidur"
            aria-label="Mínar síður"
            className="inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
          >
            <User className="size-5" />
          </Link>
          <CartButton />
        </div>
      </div>

      {/* Category strip */}
      <div className="border-t border-border/70">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-5 overflow-x-auto px-4 py-2.5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/leit?category=${c.key}`}
              className="whitespace-nowrap text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
