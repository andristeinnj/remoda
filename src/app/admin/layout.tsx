import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, ShoppingCart, Plus, Store, PackageCheck, Banknote } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const nav = [
  { href: "/admin", label: "Vörur", icon: Package },
  { href: "/admin/mottaka", label: "Móttaka", icon: PackageCheck },
  { href: "/admin/vorur/nyr", label: "Ný vara", icon: Plus },
  { href: "/admin/pantanir", label: "Pantanir", icon: ShoppingCart },
  { href: "/admin/greidslur", label: "Greiðslur", icon: Banknote },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Stjórnborð</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Stjórnborðið verður virkt þegar Supabase verkefnið hefur verið tengt og
          notandi merktur sem admin.
        </p>
      </div>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/innskraning");
  if (!user.isAdmin) redirect("/");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="md:w-56 md:shrink-0">
          <div className="flex items-center gap-2 px-2 pb-4">
            <Store className="size-5 text-primary" />
            <span className="font-display text-lg font-semibold">Stjórnborð</span>
          </div>
          <nav className="flex gap-1 overflow-x-auto md:flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary"
              >
                <item.icon className="size-4" /> {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
