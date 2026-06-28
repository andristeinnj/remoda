import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CollectionView } from "@/components/product/collection-view";
import type { ProductSort } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("collection");
  return { title: t("men"), description: t("menDesc") };
}

export default async function KarlarPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const t = await getTranslations("collection");
  return (
    <CollectionView
      title={t("men")}
      description={t("menDesc")}
      filters={{ gender: "men", sort: (sort as ProductSort) ?? "newest" }}
    />
  );
}
