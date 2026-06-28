import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Package, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderByNumber } from "@/lib/orders";
import { formatISK } from "@/lib/money";

export const metadata: Metadata = {
  title: "Pöntun staðfest",
  robots: { index: false },
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; dev?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await getOrderByNumber(orderNumber) : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <CheckCircle2 className="mx-auto size-16 text-aquamarine-600" />
      <h1 className="mt-4 font-display text-3xl font-semibold">Takk fyrir!</h1>
      <p className="mt-2 text-muted-foreground">
        Pöntun þín {orderNumber && <strong>{orderNumber}</strong>} hefur verið
        móttekin. Staðfesting hefur verið send á netfangið þitt.
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
              <dt className="text-muted-foreground">Sending</dt>
              <dd>{order.shipping_isk === 0 ? "Frí" : formatISK(order.shipping_isk)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>Samtals</dt>
              <dd>{formatISK(order.total_isk)}</dd>
            </div>
          </dl>
          {order.dropp_location_name && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-lavender-purple-50 px-3 py-2 text-sm text-lavender-purple-800">
              <MapPin className="size-4" /> Sótt á: {order.dropp_location_name}
            </p>
          )}
        </div>
      )}

      <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Package className="size-4" /> Þú færð tilkynningu frá Dropp þegar pöntunin
        er tilbúin til afhendingar.
      </p>

      <Button asChild className="mt-8">
        <Link href="/">Halda áfram að versla</Link>
      </Button>
    </div>
  );
}
