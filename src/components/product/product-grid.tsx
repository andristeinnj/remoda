import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/product/product-card";
import type { ProductWithImages } from "@/lib/supabase/types";

export async function ProductGrid({
  products,
  emptyMessage,
  enableMorph = true,
}: {
  products: ProductWithImages[];
  emptyMessage?: string;
  enableMorph?: boolean;
}) {
  const t = await getTranslations("collection");
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
        {emptyMessage ?? t("empty")}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} enableMorph={enableMorph} />
      ))}
    </div>
  );
}
