import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { QrTag } from "@/components/seller/qr-tag";

export const metadata: Metadata = { title: "QR-miði", robots: { index: false } };

export default async function TagPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseConfigured) redirect("/seljandi");
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/innskraning");

  const supabase = await createSupabaseServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, title, brand, price_isk, proposed_price_isk, qr_token, seller_id")
    .eq("id", id)
    .maybeSingle();
  if (!product || product.seller_id !== user.id) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const tagUrl = `${siteUrl}/admin/mottaka?tag=${product.qr_token}`;

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Link
        href="/seljandi"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground print:hidden"
      >
        <ArrowLeft className="size-4" /> Til baka á söluborð
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold print:hidden">QR-miði</h1>
      <p className="mt-2 text-sm text-muted-foreground print:hidden">
        Prentaðu miðann, festu hann á flíkina og sendu til ReModa. Við skönnum
        hann við móttöku.
      </p>
      <div className="mt-8">
        <QrTag
          token={product.qr_token as string}
          tagUrl={tagUrl}
          title={product.title}
          brand={product.brand}
          priceISK={product.proposed_price_isk ?? product.price_isk}
        />
      </div>
    </div>
  );
}
