"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const OPTIONS = [
  { value: "newest", label: "Nýjast fyrst" },
  { value: "price-asc", label: "Verð: lágt til hátt" },
  { value: "price-desc", label: "Verð: hátt til lágt" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("sort") ?? "newest";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", e.target.value);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Raða:</span>
      <select
        value={current}
        onChange={onChange}
        className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
