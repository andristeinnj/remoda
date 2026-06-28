import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicImageUrl, isSupabaseConfigured } from "@/lib/supabase/config";
import { formatISK } from "@/lib/money";
import { categoryLabel, genderLabel } from "@/lib/catalog";
import type { ProductWithImages } from "@/lib/supabase/types";

const STATUS_VARIANT: Record<string, "success" | "info" | "sold"> = {
  available: "success",
  reserved: "info",
  sold: "sold",
};

export default async function AdminProductsPage() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(id, storage_path, position)")
    .order("created_at", { ascending: false });
  const products = (data ?? []) as ProductWithImages[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Vörur</h1>
          <p className="text-sm text-muted-foreground">{products.length} skráðar</p>
        </div>
        <Button asChild>
          <Link href="/admin/vorur/nyr">
            <Plus className="size-4" /> Ný vara
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Vara</th>
              <th className="hidden px-4 py-3 sm:table-cell">Flokkur</th>
              <th className="px-4 py-3">Verð</th>
              <th className="px-4 py-3">Staða</th>
              <th className="px-4 py-3">
                <span className="sr-only">Aðgerðir</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => {
              const cover = p.product_images?.[0];
              return (
                <tr key={p.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        {cover && (
                          <Image
                            src={publicImageUrl(cover.storage_path)}
                            alt={p.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.brand} · {genderLabel(p.gender)}
                          {!p.published && " · óbirt"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {categoryLabel(p.category)}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatISK(p.price_isk)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[p.status] ?? "neutral"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/vorur/${p.id}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Pencil className="size-3.5" /> Breyta
                    </Link>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  Engar vörur skráðar. Smelltu á „Ný vara“ til að byrja.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
