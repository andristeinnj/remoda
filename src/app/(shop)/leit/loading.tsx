import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="skeleton h-9 w-32 rounded" />
      <div className="skeleton mt-6 h-11 w-full rounded-full" />
      <div className="mt-8">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
