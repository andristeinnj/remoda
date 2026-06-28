"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { publicImageUrl } from "@/lib/supabase/config";
import type { ProductImageRow } from "@/lib/supabase/types";

export function ProductGallery({
  images,
  title,
}: {
  images: ProductImageRow[];
  title: string;
}) {
  const t = useTranslations("productCard");
  const [active, setActive] = React.useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        {t("noImage")}
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 md:flex-col">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors md:size-20",
                i === active ? "border-primary" : "border-transparent"
              )}
              aria-label={`Mynd ${i + 1}`}
            >
              <Image
                src={publicImageUrl(img.storage_path)}
                alt={img.alt ?? title}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl bg-muted">
        <Image
          src={publicImageUrl(images[active].storage_path)}
          alt={images[active].alt ?? title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
