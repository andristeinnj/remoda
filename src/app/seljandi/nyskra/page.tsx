import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { RegisterItemForm } from "@/components/seller/register-item-form";

export const metadata: Metadata = { title: "Skrá vöru", robots: { index: false } };

export default async function RegisterItemPage() {
  if (!isSupabaseConfigured) redirect("/seljandi");
  const user = await getSessionUser();
  if (!user) redirect("/innskraning");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold">Skrá nýja vöru</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Skráðu flíkina og stingdu upp á verði. Þú færð QR-miða til að festa á hana
        áður en þú sendir til okkar.
      </p>
      <div className="mt-8">
        <RegisterItemForm />
      </div>
    </div>
  );
}
