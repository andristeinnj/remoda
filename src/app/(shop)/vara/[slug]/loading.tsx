export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="skeleton h-3 w-48 rounded" />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="skeleton aspect-[4/5] rounded-2xl" />
        <div>
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton mt-2 h-8 w-3/4 rounded" />
          <div className="skeleton mt-4 h-7 w-32 rounded" />
          <div className="mt-6 space-y-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
          <div className="skeleton mt-8 h-13 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
