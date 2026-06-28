import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatISK } from "@/lib/money";
import { signOut } from "@/app/(auth)/actions";

export const metadata: Metadata = { robots: { index: false } };

export default async function AccountPage() {
  const t = await getTranslations();

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">{t("account.title")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t("account.notConfigured")}</p>
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
            {t("account.greeting", { name: user.fullName ? `, ${user.fullName}` : "" })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <form action={signOut}>
          <Button variant="outline" size="sm" type="submit">
            <LogOut className="size-4" /> {t("account.signOut")}
          </Button>
        </form>
      </div>

      {user.isAdmin && (
        <Link
          href="/admin"
          className="mt-6 flex items-center gap-2 rounded-lg bg-lavender-purple-50 px-4 py-3 text-sm font-medium text-lavender-purple-700 hover:bg-lavender-purple-100"
        >
          <LayoutDashboard className="size-4" /> {t("account.dashboard")}
        </Link>
      )}

      <h2 className="mt-10 font-display text-xl font-semibold">{t("account.orders")}</h2>
      {!orders || orders.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          {t("account.noOrders")}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
          {orders.map((o) => (
            <li key={o.order_number} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{o.order_number}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={o.status === "paid" ? "success" : "neutral"}>
                  {t(`orderStatus.${o.status}`)}
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
