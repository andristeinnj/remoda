import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="skeleton h-9 w-40 rounded" />
      <div className="skeleton mt-3 h-4 w-56 rounded" />
      <div className="mt-8">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
