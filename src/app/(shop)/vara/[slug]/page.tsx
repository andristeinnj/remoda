import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Recycle, Ruler, Tag, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { getProductBySlug, listProducts } from "@/lib/queries";
import { formatISK } from "@/lib/money";
import {
  categoryLabel,
  conditionLabel,
  genderLabel,
  CONDITIONS,
} from "@/lib/catalog";
import { publicImageUrl } from "@/lib/supabase/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Vara fannst ekki" };
  return {
    title: product.title,
    description: product.description ?? undefined,
    openGraph: {
      title: product.title,
      images: product.product_images[0]
        ? [publicImageUrl(product.product_images[0].storage_path)]
        : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isSold = product.status === "sold";
  const onSale =
    product.original_price_isk != null &&
    product.original_price_isk > product.price_isk;
  const conditionInfo = CONDITIONS.find((c) => c.key === product.condition);
  const measurements = Object.entries(product.measurements ?? {});

  const related = (
    await listProducts({
      gender: product.gender,
      category: product.category,
      limit: 5,
    })
  )
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Forsíða
        </Link>{" "}
        /{" "}
        <Link
          href={`/leit?category=${product.category}`}
          className="hover:text-foreground"
        >
          {categoryLabel(product.category)}
        </Link>{" "}
        / <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.product_images} title={product.title} />

        <div>
          {product.brand && (
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {product.brand}
            </p>
          )}
          <h1 className="mt-1 font-display text-3xl font-semibold">
            {product.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">
              {formatISK(product.price_isk)}
            </span>
            {onSale && (
              <span className="text-base text-muted-foreground line-through">
                {formatISK(product.original_price_isk as number)}
              </span>
            )}
            {onSale && !isSold && (
              <Badge variant="sale">
                -
                {Math.round(
                  (1 - product.price_isk / (product.original_price_isk as number)) *
                    100
                )}
                %
              </Badge>
            )}
          </div>

          {/* Attributes */}
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <Attribute label="Stærð" value={product.size} />
            <Attribute label="Ástand" value={conditionLabel(product.condition)} />
            <Attribute label="Litur" value={product.color} />
            <Attribute label="Flokkur" value={categoryLabel(product.category)} />
            <Attribute label="Deild" value={genderLabel(product.gender)} />
          </dl>

          {conditionInfo && (
            <p className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
              <Tag className="mr-2 inline size-4" />
              <span className="font-medium text-foreground">
                {conditionInfo.label}:
              </span>{" "}
              {conditionInfo.description}
            </p>
          )}

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {product.description}
            </p>
          )}

          {measurements.length > 0 && (
            <div className="mt-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Ruler className="size-4" /> Mál
              </h2>
              <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                {measurements.map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border py-1">
                    <dt className="capitalize text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8">
            <AddToCartButton
              sold={isSold}
              item={{
                id: product.id,
                slug: product.slug,
                title: product.title,
                priceISK: product.price_isk,
                image: product.product_images[0]
                  ? publicImageUrl(product.product_images[0].storage_path)
                  : null,
                size: product.size,
                brand: product.brand,
              }}
            />
          </div>

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Truck className="size-4 text-lavender-purple-500" /> Sent með Dropp á
              valinn afhendingarstað
            </p>
            <p className="flex items-center gap-2">
              <Recycle className="size-4 text-lavender-purple-500" /> Eitt eintak —
              þegar það er selt er það farið
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold">Svipaðar vörur</h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}

function Attribute({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-border py-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
