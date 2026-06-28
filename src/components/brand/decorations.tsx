import { cn } from "@/lib/utils";

/** Four-point sparkle — marks the "unique find". */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-4", className)} fill="currentColor">
      <path d="M12 0c0 6.6 5.4 12 12 12-6.6 0-12 5.4-12 12 0-6.6-5.4-12-12-12 6.6 0 12-5.4 12-12Z" />
    </svg>
  );
}

/** Scalloped divider — a soft, boutique edge between sections. */
export function ScallopDivider({
  className,
  fill = "currentColor",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-3 w-full", className)}
    >
      <path
        d="M0 12 V6 C10 6 10 0 20 0 S30 6 40 6 50 0 60 0 70 6 80 6 90 0 100 0 110 6 120 6 V12 Z"
        fill={fill}
      />
    </svg>
  );
}

/** Organic blob — playful background accent. Pair with a low-opacity brand color. */
export function Blob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={cn("size-64", className)}>
      <path
        fill="currentColor"
        d="M44.7 -64.8C58.3 -56.3 69.7 -44.3 74.9 -30.2C80.1 -16.1 79.1 0.1 74.3 14.7C69.5 29.3 60.9 42.3 49.2 52.6C37.5 62.9 22.7 70.5 6.4 73.2C-9.9 75.9 -27.7 73.7 -42.6 65.5C-57.5 57.3 -69.5 43.1 -75.4 26.8C-81.3 10.5 -81.1 -7.9 -74.8 -23.7C-68.5 -39.5 -56.1 -52.7 -42 -61C-27.9 -69.3 -14 -72.7 0.7 -73.7C15.3 -74.7 30.6 -73.3 44.7 -64.8Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

/** Swing-tag outline — brand motif; also the basis for the consignment QR tags. */
export function SwingTag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn("size-6", className)}>
      <path
        d="M5 18.6 18.6 5a4 4 0 0 1 2.8-1.2H38a6 6 0 0 1 6 6v16.6a4 4 0 0 1-1.2 2.8L29.2 43a4 4 0 0 1-5.6 0L5 24.2a4 4 0 0 1 0-5.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx="34" cy="14" r="3.4" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}
