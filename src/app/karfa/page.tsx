"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { formatISK } from "@/lib/money";
import { SHIPPING_ISK, FREE_SHIPPING_THRESHOLD_ISK } from "@/lib/shipping";

export default function CartPage() {
  const t = useTranslations("cart");
  const { items, remove, subtotalISK, count } = useCart();

  const freeShipping = subtotalISK >= FREE_SHIPPING_THRESHOLD_ISK;
  const shipping = count === 0 || freeShipping ? 0 : SHIPPING_ISK;
  const total = subtotalISK + shipping;

  if (count === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-semibold">{t("emptyTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("emptyText")}</p>
        <Button asChild className="mt-6">
          <Link href="/konur">{t("checkout")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <Link
                href={`/vara/${item.slug}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </Link>
              <div className="flex flex-1 flex-col">
                {item.brand && (
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {item.brand}
                  </p>
                )}
                <Link
                  href={`/vara/${item.slug}`}
                  className="text-sm font-medium hover:text-primary"
                >
                  {item.title}
                </Link>
                {item.size && (
                  <p className="text-xs text-muted-foreground">{item.size}</p>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-semibold">{formatISK(item.priceISK)}</span>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
                  >
                    <Trash2 className="size-3.5" /> {t("remove")}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-semibold">{t("summary")}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("itemsCount", { count })}</dt>
              <dd>{formatISK(subtotalISK)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("shippingDropp")}</dt>
              <dd>{shipping === 0 ? t("free") : formatISK(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>{t("grandTotal")}</dt>
              <dd>{formatISK(total)}</dd>
            </div>
          </dl>
          {!freeShipping && (
            <p className="mt-2 text-xs text-deep-sky-blue-700">
              {t("freeShippingHint", {
                amount: formatISK(FREE_SHIPPING_THRESHOLD_ISK - subtotalISK),
              })}
            </p>
          )}
          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/kassi">
              {t("checkout")} <ArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t("securePayment")}
          </p>
        </aside>
      </div>
    </div>
  );
}
