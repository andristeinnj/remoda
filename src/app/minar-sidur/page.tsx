import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatISK } from "@/lib/money";
import { signOut } from "@/app/(auth)/actions";

export const metadata: Metadata = { title: "Mínar síður", robots: { index: false } };

const STATUS_LABEL: Record<string, string> = {
  pending: "Bíður greiðslu",
  paid: "Greitt",
  shipped: "Sent",
  cancelled: "Aflýst",
  failed: "Mistókst",
};

export default async function AccountPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">Mínar síður</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Aðgangar verða virkir þegar Supabase verkefnið hefur verið tengt.
        </p>
      </div>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/innskraning");

  const supabase = await createSupabaseServerClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("order_number, status, total_isk, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">
            Hæ{user.fullName ? `, ${user.fullName}` : ""}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <form action={signOut}>
          <Button variant="outline" size="sm" type="submit">
            <LogOut className="size-4" /> Útskrá
          </Button>
        </form>
      </div>

      {user.isAdmin && (
        <Link
          href="/admin"
          className="mt-6 flex items-center gap-2 rounded-lg bg-lavender-purple-50 px-4 py-3 text-sm font-medium text-lavender-purple-700 hover:bg-lavender-purple-100"
        >
          <LayoutDashboard className="size-4" /> Fara í stjórnborð
        </Link>
      )}

      <h2 className="mt-10 font-display text-xl font-semibold">Pantanir</h2>
      {!orders || orders.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          Þú átt engar pantanir ennþá.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
          {orders.map((o) => (
            <li key={o.order_number} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{o.order_number}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString("is-IS")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={o.status === "paid" ? "success" : "neutral"}>
                  {STATUS_LABEL[o.status] ?? o.status}
                </Badge>
                <span className="font-semibold">{formatISK(o.total_isk)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
