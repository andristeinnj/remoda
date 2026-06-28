import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatISK } from "@/lib/money";
import { markPayoutPaid } from "@/app/admin/actions";

export default async function AdminPayoutsPage() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();

  const { data: payouts } = await supabase
    .from("payouts")
    .select("id, seller_id, amount_isk, gross_isk, commission_isk, status, created_at, products(title)")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  const sellerIds = [...new Set((payouts ?? []).map((p) => p.seller_id).filter(Boolean))] as string[];
  const { data: profiles } = sellerIds.length
    ? await supabase.from("profiles").select("id, full_name, iban").in("id", sellerIds)
    : { data: [] };
  const sellerById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const pendingTotal = (payouts ?? [])
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount_isk, 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Greiðslur til seljenda</h1>
          <p className="text-sm text-muted-foreground">
            70% af hverri sölu. Millifærðu og merktu sem greitt.
          </p>
        </div>
        <div className="rounded-xl border border-border px-4 py-2 text-right">
          <p className="text-xs text-muted-foreground">Útistandandi</p>
          <p className="font-display text-xl font-semibold">{formatISK(pendingTotal)}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Seljandi</th>
              <th className="px-4 py-3">Vara</th>
              <th className="px-4 py-3">Sala</th>
              <th className="px-4 py-3">Til seljanda</th>
              <th className="px-4 py-3">Staða</th>
              <th className="px-4 py-3"><span className="sr-only">Aðgerð</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(payouts ?? []).map((p) => {
              const seller = p.seller_id ? sellerById.get(p.seller_id) : null;
              const product = p.products as { title?: string } | null;
              return (
                <tr key={p.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <p className="font-medium">{seller?.full_name ?? "—"}</p>
                    <p className="font-mono text-xs text-muted-foreground">{seller?.iban ?? "Vantar IBAN"}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{product?.title ?? "—"}</td>
                  <td className="px-4 py-3">{formatISK(p.gross_isk)}</td>
                  <td className="px-4 py-3 font-semibold">{formatISK(p.amount_isk)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === "paid" ? "success" : "info"}>
                      {p.status === "paid" ? "Greitt" : "Bíður"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status === "pending" && (
                      <form action={markPayoutPaid.bind(null, p.id)}>
                        <Button type="submit" size="sm" variant="outline">
                          <Banknote className="size-4" /> Merkja greitt
                        </Button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
            {(!payouts || payouts.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  Engar greiðslur ennþá.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
