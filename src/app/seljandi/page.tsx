import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Plus, QrCode, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { publicImageUrl } from "@/lib/supabase/config";
import { formatISK } from "@/lib/money";

export const metadata: Metadata = { title: "Söluborð", robots: { index: false } };

const INTAKE_LABEL: Record<string, string> = {
  awaiting_reception: "Bíður móttöku",
  received: "Móttekið",
  listed: "Í sölu",
  rejected: "Hafnað",
};

export default async function SellerDashboard() {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Söluborð</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Verður virkt þegar Supabase verkefnið er tengt.
        </p>
      </div>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/innskraning");

  const supabase = await createSupabaseServerClient();
  const [{ data: profile }, { data: items }, { data: payouts }] = await Promise.all([
    supabase.from("profiles").select("iban, full_name").eq("id", user.id).maybeSingle(),
    supabase
      .from("products")
      .select("id, title, status, intake_status, price_isk, proposed_price_isk, product_images(storage_path, position)")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("payouts").select("amount_isk, status").eq("seller_id", user.id),
  ]);

  const pending = (payouts ?? []).filter((p) => p.status === "pending").reduce((s, p) => s + p.amount_isk, 0);
  const paid = (payouts ?? []).filter((p) => p.status === "paid").reduce((s, p) => s + p.amount_isk, 0);
  const needsPayoutInfo = !profile?.iban;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Söluborð</h1>
          <p className="text-sm text-muted-foreground">Þínar vörur og greiðslur</p>
        </div>
        <Button asChild>
          <Link href="/seljandi/nyskra">
            <Plus className="size-4" /> Skrá vöru
          </Link>
        </Button>
      </div>

      {/* Balance */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border p-5">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Wallet className="size-4" /> Bíður greiðslu
          </p>
          <p className="mt-1 font-display text-2xl font-semibold">{formatISK(pending)}</p>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <p className="text-xs text-muted-foreground">Greitt samtals</p>
          <p className="mt-1 font-display text-2xl font-semibold">{formatISK(paid)}</p>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <p className="text-xs text-muted-foreground">Vörur skráðar</p>
          <p className="mt-1 font-display text-2xl font-semibold">{items?.length ?? 0}</p>
        </div>
      </div>

      {needsPayoutInfo && (
        <Link
          href="/seljandi/upplysingar"
          className="mt-6 flex items-center gap-3 rounded-xl bg-banana-cream-100 px-4 py-3 text-sm text-banana-cream-900 hover:bg-banana-cream-200"
        >
          <AlertCircle className="size-5 shrink-0" />
          Bættu við greiðsluupplýsingum (IBAN) svo við getum greitt þér þegar vörur seljast.
        </Link>
      )}

      {/* Items */}
      <h2 className="mt-10 font-display text-xl font-semibold">Vörurnar þínar</h2>
      {!items || items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          Engar vörur skráðar ennþá. Smelltu á „Skrá vöru“ til að byrja.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const cover = item.product_images?.sort((a, b) => a.position - b.position)[0];
            const display = item.status === "sold" ? "Selt" : INTAKE_LABEL[item.intake_status] ?? item.intake_status;
            return (
              <li key={item.id} className="flex items-center gap-4 rounded-xl border border-border p-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {cover && (
                    <Image src={publicImageUrl(cover.storage_path)} alt="" fill sizes="64px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatISK(item.price_isk)}
                    {item.status !== "sold" && item.intake_status !== "listed" && item.proposed_price_isk
                      ? ` · uppástunga ${formatISK(item.proposed_price_isk)}`
                      : ""}
                  </p>
                </div>
                <Badge variant={item.status === "sold" ? "success" : item.intake_status === "listed" ? "brand" : "info"}>
                  {display}
                </Badge>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/seljandi/vara/${item.id}/mida`} aria-label="QR-miði">
                      <QrCode className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/seljandi/vara/${item.id}`}>Opna</Link>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
