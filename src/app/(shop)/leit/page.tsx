import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterBar } from "@/components/product/filter-bar";
import { ProductGrid } from "@/components/product/product-grid";
import { SortSelect } from "@/components/product/sort-select";
import { listProducts, type ProductSort } from "@/lib/queries";
import type { ProductGender } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Leit",
  description: "Leitaðu í öllum vörum ReModa.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const products = await listProducts({
    gender: sp.gender as ProductGender | undefined,
    category: sp.category,
    sale: sp.sale === "1",
    search: sp.q,
    sort: (sp.sort as ProductSort) ?? "newest",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Leit</h1>
      <div className="mt-6">
        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {products.length} {products.length === 1 ? "vara" : "vörur"}
        </p>
        <Suspense>
          <SortSelect />
        </Suspense>
      </div>

      <div className="mt-6">
        <ProductGrid
          products={products}
          emptyMessage="Engar vörur passa við leitina. Prófaðu að hreinsa síur."
        />
      </div>
    </div>
  );
}
