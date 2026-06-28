import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getDroppLocations } from "@/lib/dropp";

export const metadata: Metadata = {
  title: "Kassi",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const locations = await getDroppLocations();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Ganga frá pöntun</h1>
      <div className="mt-8">
        <CheckoutForm locations={locations} />
      </div>
    </div>
  );
}
