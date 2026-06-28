"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { CATEGORIES, GENDERS } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function FilterBar() {
  const t = useTranslations();
  const router = useRouter();
  const params = useSearchParams();

  const activeCategory = params.get("category") ?? "";
  const activeGender = params.get("gender") ?? "";
  const saleOnly = params.get("sale") === "1";
  const q = params.get("q") ?? "";

  function update(mutate: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    router.push(`/leit?${next.toString()}`);
  }

  function toggle(key: string, value: string) {
    update((p) => {
      if (p.get(key) === value) p.delete(key);
      else p.set(key, value);
    });
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const value = new FormData(e.currentTarget).get("q") as string;
          update((p) => {
            if (value) p.set("q", value);
            else p.delete("q");
          });
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          name="q"
          type="search"
          defaultValue={q}
          aria-label={t("collection.search")}
          placeholder={t("filters.searchPlaceholder")}
          className="w-full rounded-full border border-border bg-background py-2.5 pl-11 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </form>

      <div className="flex flex-wrap gap-2">
        {GENDERS.map((g) => (
          <Chip
            key={g.key}
            active={activeGender === g.key}
            onClick={() => toggle("gender", g.key)}
          >
            {t(`gender.${g.key}`)}
          </Chip>
        ))}
        <span className="mx-1 w-px self-stretch bg-border" />
        {CATEGORIES.map((c) => (
          <Chip
            key={c.key}
            active={activeCategory === c.key}
            onClick={() => toggle("category", c.key)}
          >
            {t(`category.${c.key}`)}
          </Chip>
        ))}
        <Chip active={saleOnly} onClick={() => toggle("sale", "1")} variant="sale">
          {t("filters.sale")}
        </Chip>
      </div>

      {(activeCategory || activeGender || saleOnly || q) && (
        <button
          type="button"
          onClick={() => router.push("/leit")}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" /> {t("filters.clear")}
        </button>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  variant = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "sale";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? variant === "sale"
            ? "border-accent bg-accent text-accent-foreground"
            : "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}
