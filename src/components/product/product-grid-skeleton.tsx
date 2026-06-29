export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[4/5] rounded-xl" />
          <div className="skeleton mt-3 h-3 w-1/2 rounded" />
          <div className="skeleton mt-2 h-3 w-3/4 rounded" />
          <div className="skeleton mt-2 h-3 w-1/3 rounded" />
        </div>
      ))}
    </div>
  );
}
