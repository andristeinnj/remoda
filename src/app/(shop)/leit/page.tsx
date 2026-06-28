import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { FilterBar } from "@/components/product/filter-bar";
import { ProductGrid } from "@/components/product/product-grid";
import { SortSelect } from "@/components/product/sort-select";
import { listProducts, type ProductSort } from "@/lib/queries";
import type { ProductGender } from "@/lib/supabase/types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("collection");
  return { title: t("search") };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const t = await getTranslations();
  const products = await listProducts({
    gender: sp.gender as ProductGender | undefined,
    category: sp.category,
    sale: sp.sale === "1",
    search: sp.q,
    sort: (sp.sort as ProductSort) ?? "newest",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{t("collection.search")}</h1>
      <div className="mt-6">
        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {t("common.productCount", { count: products.length })}
        </p>
        <Suspense>
          <SortSelect />
        </Suspense>
      </div>

      <div className="mt-6">
        <ProductGrid
          products={products}
          emptyMessage={t("collection.emptyFiltered")}
        />
      </div>
    </div>
  );
}
