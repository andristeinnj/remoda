import { getTranslations } from "next-intl/server";
import { ProductGrid } from "@/components/product/product-grid";
import { SortSelect } from "@/components/product/sort-select";
import { listProducts, type ProductFilters } from "@/lib/queries";

export async function CollectionView({
  title,
  description,
  filters,
}: {
  title: string;
  description?: string;
  filters: ProductFilters;
}) {
  const t = await getTranslations("common");
  const products = await listProducts(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {t("productCount", { count: products.length })}
          </p>
        </div>
        <SortSelect />
      </div>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
