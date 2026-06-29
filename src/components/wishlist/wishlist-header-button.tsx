"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/components/wishlist/wishlist-provider";

export function WishlistHeaderButton({ label }: { label: string }) {
  const { count } = useWishlist();
  return (
    <Link
      href="/oskalisti"
      aria-label={`${label} (${count})`}
      className="relative inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
    >
      <Heart className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
