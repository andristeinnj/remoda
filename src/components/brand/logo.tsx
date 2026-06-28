import { cn } from "@/lib/utils";

/**
 * ReModa brand mark — a rounded "renewal tag": a tag tile in the brand gradient
 * with a circular refresh loop (resell / renew) and a spark of the unique find.
 * The tag also nods to the QR swing-tags used in the consignment intake flow.
 */
export function BrandMark({
  className,
  title = "ReModa",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={cn("size-9", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="remoda-mark" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7624db" />
          <stop offset="1" stopColor="#eb1495" />
        </linearGradient>
      </defs>
      {/* Tag tile */}
      <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#remoda-mark)" />
      {/* Tag hole */}
      <circle cx="15" cy="15" r="3.1" fill="#fff" fillOpacity="0.9" />
      {/* Circular refresh loop = renew / resell */}
      <g
        fill="none"
        stroke="#fff"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32.5 22.2a8.5 8.5 0 1 0 1.2 9.2" />
        <path d="M33.4 15.6v6.6h-6.6" />
      </g>
      {/* Spark */}
      <path
        d="M35 33.5c0 2 1.4 3.4 3.4 3.4-2 0-3.4 1.4-3.4 3.4 0-2-1.4-3.4-3.4-3.4 2 0 3.4-1.4 3.4-3.4Z"
        fill="#fedc01"
      />
    </svg>
  );
}

/** Wordmark — "ReModa" set in the display serif with the accent dot. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-2xl font-semibold tracking-tight leading-none",
        className
      )}
    >
      Re<span className="text-accent">Moda</span>
    </span>
  );
}

/** Full lockup: mark + wordmark. */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
  showMark = true,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showMark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {showMark && <BrandMark className={markClassName} />}
      <Wordmark className={wordmarkClassName} />
    </span>
  );
}
