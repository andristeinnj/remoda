import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { formatISK } from "@/lib/money";
import { publicImageUrl } from "@/lib/supabase/config";
import type { ProductWithImages } from "@/lib/supabase/types";

export async function ProductCard({
  product,
  enableMorph = true,
}: {
  product: ProductWithImages;
  enableMorph?: boolean;
}) {
  const t = await getTranslations();
  const cover = product.product_images?.[0];
  const hoverImage = product.product_images?.[1];
  const isSold = product.status === "sold";
  const onSale =
    product.original_price_isk != null &&
    product.original_price_isk > product.price_isk;
  const discount = onSale
    ? Math.round(
        (1 - product.price_isk / (product.original_price_isk as number)) * 100
      )
    : 0;

  const wishItem = {
    id: product.id,
    slug: product.slug,
    title: product.title,
    priceISK: product.price_isk,
    image: cover ? publicImageUrl(cover.storage_path) : null,
    size: product.size,
    brand: product.brand,
  };

  return (
    <Link href={`/vara/${product.slug}`} className="group block">
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted"
        style={enableMorph ? { viewTransitionName: `vt-${product.slug}` } : undefined}
      >
        {cover ? (
          <Image
            src={publicImageUrl(cover.storage_path)}
            alt={cover.alt ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {t("productCard.noImage")}
          </div>
        )}

        {/* Boozt-style: reveal a second photo on hover */}
        {hoverImage && (
          <Image
            src={publicImageUrl(hoverImage.storage_path)}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {onSale && !isSold && <Badge variant="sale">-{discount}%</Badge>}
          {product.condition === "new_with_tags" && !isSold && (
            <Badge variant="success">{t("productCard.newTag")}</Badge>
          )}
        </div>

        {!isSold && (
          <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
            <WishlistButton item={wishItem} />
          </div>
        )}

        {isSold && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
            <Badge variant="sold" className="px-4 py-1.5 text-sm">
              {t("productCard.sold")}
            </Badge>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-0.5">
        {product.brand && (
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </p>
        )}
        <h3 className="line-clamp-1 text-sm font-medium text-foreground">
          {product.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {[product.size, t(`condition.${product.condition}`)]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-semibold text-foreground">
            {formatISK(product.price_isk)}
          </span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatISK(product.original_price_isk as number)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
