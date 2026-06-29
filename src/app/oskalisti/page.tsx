"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Heart, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { useCart } from "@/components/cart/cart-provider";
import { formatISK } from "@/lib/money";

export default function WishlistPage() {
  const t = useTranslations();
  const { items, remove } = useWishlist();
  const cart = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <Heart className="size-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-semibold">
          {t("wishlist.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("wishlist.empty")}</p>
        <Button asChild className="mt-6">
          <Link href="/konur">{t("common.shopNow")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{t("wishlist.title")}</h1>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="group relative">
            <Link href={`/vara/${item.slug}`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
            </Link>
            <button
              type="button"
              onClick={() => remove(item.id)}
              aria-label={t("wishlist.remove")}
              className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur hover:bg-background"
            >
              <X className="size-4" />
            </button>
            <div className="mt-3 space-y-0.5">
              {item.brand && (
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.brand}
                </p>
              )}
              <Link
                href={`/vara/${item.slug}`}
                className="line-clamp-1 text-sm font-medium hover:text-primary"
              >
                {item.title}
              </Link>
              <p className="text-sm font-semibold">{formatISK(item.priceISK)}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full"
                disabled={cart.has(item.id)}
                onClick={() => cart.add(item)}
              >
                <ShoppingBag className="size-4" />
                {cart.has(item.id) ? t("product.inCart") : t("product.addToCart")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
