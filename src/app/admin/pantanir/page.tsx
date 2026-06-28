import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatISK } from "@/lib/money";

const STATUS_LABEL: Record<string, string> = {
  pending: "Bíður greiðslu",
  paid: "Greitt",
  shipped: "Sent",
  cancelled: "Aflýst",
  failed: "Mistókst",
};

export default async function AdminOrdersPage() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "order_number, status, customer_name, customer_email, total_isk, dropp_location_name, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Pantanir</h1>
      <p className="text-sm text-muted-foreground">{orders?.length ?? 0} pantanir</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Pöntun</th>
              <th className="px-4 py-3">Viðskiptavinur</th>
              <th className="hidden px-4 py-3 md:table-cell">Afhending</th>
              <th className="px-4 py-3">Upphæð</th>
              <th className="px-4 py-3">Staða</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(orders ?? []).map((o) => (
              <tr key={o.order_number} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <p className="font-medium">{o.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleString("is-IS")}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p>{o.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{o.customer_email}</p>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {o.dropp_location_name ?? "—"}
                </td>
                <td className="px-4 py-3 font-medium">{formatISK(o.total_isk)}</td>
                <td className="px-4 py-3">
                  <Badge variant={o.status === "paid" ? "success" : "neutral"}>
                    {STATUS_LABEL[o.status] ?? o.status}
                  </Badge>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  Engar pantanir ennþá.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
