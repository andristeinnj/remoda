"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/karfa"
      aria-label={`Karfa, ${count} vörur`}
      className="relative inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
