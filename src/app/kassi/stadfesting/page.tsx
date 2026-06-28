import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CheckCircle2, Package, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderByNumber } from "@/lib/orders";
import { formatISK } from "@/lib/money";

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; dev?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const t = await getTranslations("confirmation");
  const order = orderNumber ? await getOrderByNumber(orderNumber) : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <CheckCircle2 className="mx-auto size-16 text-aquamarine-600" />
      <h1 className="mt-4 font-display text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">
        {t("received", { order: orderNumber ?? "" })}
      </p>

      {order && (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-left">
          <ul className="space-y-2 text-sm">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item.title}</span>
                <span className="font-medium">{formatISK(item.price)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("shipping")}</dt>
              <dd>{formatISK(order.shipping_isk)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>{t("total")}</dt>
              <dd>{formatISK(order.total_isk)}</dd>
            </div>
          </dl>
          {order.dropp_location_name && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-lavender-purple-50 px-3 py-2 text-sm text-lavender-purple-800">
              <MapPin className="size-4" /> {t("pickup", { location: order.dropp_location_name })}
            </p>
          )}
        </div>
      )}

      <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Package className="size-4" /> {t("droppNote")}
      </p>

      <Button asChild className="mt-8">
        <Link href="/">{t("continue")}</Link>
      </Button>
    </div>
  );
}
