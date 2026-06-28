"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/components/cart/cart-provider";

export function AddToCartButton({
  item,
  sold,
}: {
  item: CartItem;
  sold: boolean;
}) {
  const { add, has } = useCart();
  const router = useRouter();
  const inCart = has(item.id);

  if (sold) {
    return (
      <Button size="lg" variant="outline" disabled className="w-full">
        Selt
      </Button>
    );
  }

  if (inCart) {
    return (
      <Button
        size="lg"
        variant="accent"
        className="w-full"
        onClick={() => router.push("/karfa")}
      >
        <Check className="size-4" /> Í körfu — fara á kassa
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      variant="primary"
      className="w-full"
      onClick={() => add(item)}
    >
      <ShoppingBag className="size-4" /> Setja í körfu
    </Button>
  );
}
