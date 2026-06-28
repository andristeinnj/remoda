import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Recycle, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { listProducts } from "@/lib/queries";
import { CATEGORIES, GENDERS } from "@/lib/catalog";

export default async function HomePage() {
  const t = await getTranslations();
  const [newest, onSale] = await Promise.all([
    listProducts({ sort: "newest", limit: 8 }),
    listProducts({ sale: true, limit: 4 }),
  ]);

  const valueProps = [
    { icon: Recycle, title: t("valueProps.sustainableTitle"), text: t("valueProps.sustainableText") },
    { icon: ShieldCheck, title: t("valueProps.checkedTitle"), text: t("valueProps.checkedText") },
    { icon: Truck, title: t("valueProps.shippingTitle"), text: t("valueProps.shippingText") },
    { icon: Sparkles, title: t("valueProps.uniqueTitle"), text: t("valueProps.uniqueText") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-lavender-purple-50">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-lavender-purple-100 px-3 py-1 text-xs font-semibold text-lavender-purple-700">
              <Sparkles className="size-3.5" /> {t("home.badge")}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-lavender-purple-900 md:text-6xl">
              {t("home.title1")}
              <br />
              <span className="text-accent">{t("home.title2")}</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-lavender-purple-800/80">
              {t("home.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="primary">
                <Link href="/konur">
                  {t("home.shopWomen")} <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/karlar">{t("home.shopMen")}</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-lavender-purple-100 md:aspect-square">
            <Image
              src="https://picsum.photos/seed/remoda-hero/1000/1000"
              alt="ReModa"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          {valueProps.map((v) => (
            <div key={v.title} className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lavender-purple-100 text-lavender-purple-600">
                <v.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{v.title}</p>
                <p className="text-xs text-muted-foreground">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-display text-2xl font-semibold">{t("home.categories")}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.slice(0, 6).map((c) => (
            <Link
              key={c.key}
              href={`/leit?category=${c.key}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={`https://picsum.photos/seed/remoda-cat-${c.key}/400/400`}
                alt={t(`category.${c.key}`)}
                fill
                sizes="(max-width: 640px) 50vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-lavender-purple-950/70 to-transparent p-3">
                <span className="text-sm font-semibold text-white">
                  {t(`category.${c.key}`)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Newest */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">{t("home.newArrivals")}</h2>
          <Link
            href="/leit?sort=newest"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("common.seeAll")} <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-6">
          <ProductGrid products={newest} />
        </div>
      </section>

      {/* Sale banner */}
      {onSale.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="rounded-2xl bg-deep-pink-50 p-6 md:p-10">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-deep-pink-700">
                  {t("home.saleTitle")}
                </h2>
                <p className="mt-1 text-sm text-deep-pink-700/80">
                  {t("home.saleSubtitle")}
                </p>
              </div>
              <Link
                href="/leit?sale=1"
                className="inline-flex items-center gap-1 text-sm font-medium text-deep-pink-700 hover:underline"
              >
                {t("common.seeAll")} <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6">
              <ProductGrid products={onSale} />
            </div>
          </div>
        </section>
      )}

      {/* Gender split CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          {GENDERS.slice(0, 2).map((g) => (
            <Link
              key={g.key}
              href={`/${g.slug}`}
              className="group relative flex aspect-[16/7] items-center overflow-hidden rounded-2xl bg-muted"
            >
              <Image
                src={`https://picsum.photos/seed/remoda-gender-${g.key}/900/400`}
                alt={t(`gender.${g.key}`)}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-lavender-purple-950/30" />
              <span className="relative px-8">
                <span className="font-display text-3xl font-semibold text-white">
                  {t(`gender.${g.key}`)}
                </span>
                <span className="mt-1 flex items-center gap-1 text-sm font-medium text-white">
                  {t("common.shopNow")} <ArrowRight className="size-4" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
