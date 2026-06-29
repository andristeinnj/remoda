"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useWishlist, type WishItem } from "@/components/wishlist/wishlist-provider";

export function WishlistButton({
  item,
  className,
  size = "md",
}: {
  item: WishItem;
  className?: string;
  size?: "md" | "lg";
}) {
  const t = useTranslations("wishlist");
  const { has, toggle } = useWishlist();
  const active = has(item.id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? t("remove") : t("add")}
      title={active ? t("remove") : t("add")}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors",
        size === "lg" ? "size-11 border border-border hover:bg-muted" : "size-9 bg-background/80 backdrop-blur hover:bg-background",
        className
      )}
    >
      <Heart
        className={cn(
          size === "lg" ? "size-5" : "size-4",
          active ? "fill-accent text-accent" : "text-foreground"
        )}
      />
    </button>
  );
}
