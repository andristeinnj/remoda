import type { Metadata } from "next";
import { CollectionView } from "@/components/product/collection-view";
import type { ProductSort } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Kvenföt",
  description: "Notuð gæðaföt fyrir konur — kjólar, yfirhafnir, prjón og fleira.",
};

export default async function KonurPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  return (
    <CollectionView
      title="Konur"
      description="Handvalin kvenföt á nýju lífi"
      filters={{ gender: "women", sort: (sort as ProductSort) ?? "newest" }}
    />
  );
}
