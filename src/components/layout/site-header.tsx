import Link from "next/link";
import { Search, User } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CartButton } from "@/components/cart/cart-button";
import { WishlistHeaderButton } from "@/components/wishlist/wishlist-header-button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/brand/logo";
import { CATEGORIES } from "@/lib/catalog";

export async function SiteHeader() {
  const t = await getTranslations();

  const categories = CATEGORIES.map((c) => ({
    key: c.key,
    label: t(`category.${c.key}`),
  }));
  const mega = [
    { label: t("nav.women"), href: "/konur", gender: "women" },
    { label: t("nav.men"), href: "/karlar", gender: "men" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      {/* Announcement bar */}
      <div className="bg-lavender-purple-600 text-center text-xs font-medium text-white">
        <div className="mx-auto max-w-7xl px-4 py-2">{t("announcement")}</div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
        <Link href="/" className="shrink-0" aria-label="ReModa">
          <Logo />
        </Link>

        <nav className="hidden flex-1 md:block">
          <ul className="flex items-center gap-7">
            {mega.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center py-5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
                {/* Mega menu */}
                <div className="invisible absolute left-0 top-full z-50 w-[32rem] -translate-y-1 rounded-2xl border border-border bg-background p-5 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="grid grid-cols-3 gap-x-4 gap-y-0.5">
                    {categories.map((c) => (
                      <Link
                        key={c.key}
                        href={`/leit?gender=${item.gender}&category=${c.key}`}
                        className="rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-5 border-t border-border pt-3 text-sm font-medium">
                    <Link href={item.href} className="text-primary hover:underline">
                      {t("common.seeAll")}
                    </Link>
                    <Link
                      href={`/leit?gender=${item.gender}&sale=1`}
                      className="text-accent hover:underline"
                    >
                      {t("nav.sale")}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
            <li>
              <Link href="/leit?sort=newest" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {t("nav.new")}
              </Link>
            </li>
            <li>
              <Link href="/leit?sale=1" className="text-sm font-medium text-accent hover:underline">
                {t("nav.sale")}
              </Link>
            </li>
            <li>
              <Link href="/selja" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {t("nav.sell")}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher />
          <Link
            href="/leit"
            aria-label={t("nav.search")}
            className="inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
          >
            <Search className="size-5" />
          </Link>
          <WishlistHeaderButton label={t("nav.wishlist")} />
          <Link
            href="/minar-sidur"
            aria-label={t("nav.account")}
            className="inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
          >
            <User className="size-5" />
          </Link>
          <CartButton label={t("nav.cart")} />
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
              {t(`category.${c.key}`)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
