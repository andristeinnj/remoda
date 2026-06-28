import { ProductCard } from "@/components/product/product-card";
import type { ProductWithImages } from "@/lib/supabase/types";

export function ProductGrid({
  products,
  emptyMessage = "Engar vörur fundust.",
}: {
  products: ProductWithImages[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
