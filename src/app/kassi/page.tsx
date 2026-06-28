import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getDroppLocations } from "@/lib/dropp";

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function CheckoutPage() {
  const t = await getTranslations("checkout");
  const locations = await getDroppLocations();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
      <div className="mt-8">
        <CheckoutForm locations={locations} />
      </div>
    </div>
  );
}
