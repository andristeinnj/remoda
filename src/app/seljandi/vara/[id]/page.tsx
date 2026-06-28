import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, QrCode, Upload, Trash2 } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, publicImageUrl } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatISK } from "@/lib/money";
import { conditionLabel } from "@/lib/catalog";
import { addSellerPhotos, deleteSellerItem } from "@/app/seljandi/actions";

export const metadata: Metadata = { title: "Vara", robots: { index: false } };

const INTAKE_LABEL: Record<string, string> = {
  awaiting_reception: "Bíður móttöku",
  received: "Móttekið",
  listed: "Í sölu",
  rejected: "Hafnað",
};

export default async function SellerItemPage({
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
    .select("*, product_images(id, storage_path, position)")
    .eq("id", id)
    .maybeSingle();
  if (!product || product.seller_id !== user.id) notFound();

  const images = (product.product_images ?? []).sort(
    (a: { position: number }, b: { position: number }) => a.position - b.position
  );
  const canUpload = product.photos_by === "seller" && product.intake_status !== "listed";
  const canDelete = product.intake_status === "awaiting_reception";
  const display =
    product.status === "sold" ? "Selt" : INTAKE_LABEL[product.intake_status] ?? product.intake_status;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/seljandi"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Söluborð
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">{product.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.brand} · {conditionLabel(product.condition)}
          </p>
        </div>
        <Badge variant={product.status === "sold" ? "success" : product.intake_status === "listed" ? "brand" : "info"}>
          {display}
        </Badge>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-border p-3">
          <dt className="text-muted-foreground">Verðhugmynd þín</dt>
          <dd className="font-semibold">{product.proposed_price_isk ? formatISK(product.proposed_price_isk) : "—"}</dd>
        </div>
        <div className="rounded-lg border border-border p-3">
          <dt className="text-muted-foreground">Samþykkt verð</dt>
          <dd className="font-semibold">
            {product.intake_status === "listed" ? formatISK(product.price_isk) : "Bíður yfirferðar"}
          </dd>
        </div>
      </dl>

      {product.intake_status === "rejected" && product.rejection_reason && (
        <p className="mt-4 rounded-lg bg-deep-pink-50 px-3 py-2 text-sm text-deep-pink-700">
          Hafnað: {product.rejection_reason}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href={`/seljandi/vara/${product.id}/mida`}>
            <QrCode className="size-4" /> QR-miði
          </Link>
        </Button>
        {canDelete && (
          <form action={deleteSellerItem.bind(null, product.id)}>
            <Button type="submit" variant="ghost">
              <Trash2 className="size-4" /> Eyða
            </Button>
          </form>
        )}
      </div>

      {/* Images */}
      <h2 className="mt-10 font-display text-lg font-semibold">Myndir</h2>
      {images.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((img: { id: string; storage_path: string }) => (
            <div key={img.id} className="relative size-24 overflow-hidden rounded-lg border border-border">
              <Image src={publicImageUrl(img.storage_path)} alt="" fill sizes="96px" className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          {product.photos_by === "admin" ? "ReModa myndar vöruna við móttöku." : "Engar myndir ennþá."}
        </p>
      )}

      {canUpload && (
        <form action={addSellerPhotos.bind(null, product.id)} className="mt-4">
          <label className="block text-sm font-medium">
            Bæta við myndum
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-lavender-purple-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-lavender-purple-700"
            />
          </label>
          <Button type="submit" className="mt-3" variant="outline">
            <Upload className="size-4" /> Hlaða upp
          </Button>
        </form>
      )}
    </div>
  );
}
