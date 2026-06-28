import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";
import { saveSellerProfile } from "@/app/seljandi/actions";

export const metadata: Metadata = { title: "Greiðsluupplýsingar", robots: { index: false } };

export default async function SellerInfoPage() {
  if (!isSupabaseConfigured) redirect("/seljandi");
  const user = await getSessionUser();
  if (!user) redirect("/innskraning");

  const supabase = await createSupabaseServerClient();
  const { data: p } = await supabase
    .from("profiles")
    .select("full_name, phone, kennitala, iban, bank_name, address, postcode, city")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold">Greiðsluupplýsingar</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Við notum þetta til að greiða þér 70% þegar vörur þínar seljast.
      </p>
      <form action={saveSellerProfile} className="mt-8 grid gap-4 sm:grid-cols-2">
        <F label="Fullt nafn" name="full_name" defaultValue={p?.full_name} required full />
        <F label="Símanúmer" name="phone" defaultValue={p?.phone} type="tel" />
        <F label="Kennitala" name="kennitala" defaultValue={p?.kennitala} />
        <F label="IBAN / reikningsnúmer" name="iban" defaultValue={p?.iban} full />
        <F label="Banki" name="bank_name" defaultValue={p?.bank_name} />
        <F label="Heimilisfang" name="address" defaultValue={p?.address} full />
        <F label="Póstnúmer" name="postcode" defaultValue={p?.postcode} />
        <F label="Staður" name="city" defaultValue={p?.city} />
        <div className="sm:col-span-2">
          <Button type="submit">Vista upplýsingar</Button>
        </div>
      </form>
    </div>
  );
}

function F({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  full,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <label className={`block text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}
