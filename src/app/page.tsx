import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Recycle, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { listProducts } from "@/lib/queries";
import { CATEGORIES, GENDERS } from "@/lib/catalog";

export default async function HomePage() {
  const [newest, onSale] = await Promise.all([
    listProducts({ sort: "newest", limit: 8 }),
    listProducts({ sale: true, limit: 4 }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-lavender-purple-50">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-lavender-purple-100 px-3 py-1 text-xs font-semibold text-lavender-purple-700">
              <Sparkles className="size-3.5" /> Endurnýjuð tíska
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-lavender-purple-900 md:text-6xl">
              Einstök föt,
              <br />
              <span className="text-accent">nýtt líf.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-lavender-purple-800/80">
              Handvalin notuð gæðaföt fyrir konur og karla. Verslaðu sjálfbært —
              hvert plagg er einstakt og á sér sögu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="primary">
                <Link href="/konur">
                  Versla kvenföt <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/karlar">Versla karlaföt</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-lavender-purple-100 md:aspect-square">
            <Image
              src="https://picsum.photos/seed/remoda-hero/1000/1000"
              alt="ReModa tíska"
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
          {[
            { icon: Recycle, title: "Sjálfbært", text: "Lengjum líftíma fata" },
            { icon: ShieldCheck, title: "Yfirfarið", text: "Hvert plagg gæðametið" },
            { icon: Truck, title: "Sent með Dropp", text: "Um allt land" },
            { icon: Sparkles, title: "Einstakt", text: "Eitt eintak af hverju" },
          ].map((v) => (
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
        <h2 className="font-display text-2xl font-semibold">Flokkar</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.slice(0, 6).map((c) => (
            <Link
              key={c.key}
              href={`/leit?category=${c.key}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={`https://picsum.photos/seed/remoda-cat-${c.key}/400/400`}
                alt={c.label}
                fill
                sizes="(max-width: 640px) 50vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-lavender-purple-950/70 to-transparent p-3">
                <span className="text-sm font-semibold text-white">{c.label}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Newest */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Nýjar vörur</h2>
          <Link
            href="/leit?sort=newest"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Sjá allt <ArrowRight className="size-4" />
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
                  Útsala
                </h2>
                <p className="mt-1 text-sm text-deep-pink-700/80">
                  Gerðu góð kaup á einstökum flíkum
                </p>
              </div>
              <Link
                href="/leit?sale=1"
                className="inline-flex items-center gap-1 text-sm font-medium text-deep-pink-700 hover:underline"
              >
                Sjá allt <ArrowRight className="size-4" />
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
                alt={g.label}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-lavender-purple-950/30" />
              <span className="relative px-8">
                <span className="font-display text-3xl font-semibold text-white">
                  {g.label}
                </span>
                <span className="mt-1 flex items-center gap-1 text-sm font-medium text-white">
                  Versla núna <ArrowRight className="size-4" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
