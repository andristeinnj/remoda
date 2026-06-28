import type { Metadata } from "next";
import { CollectionView } from "@/components/product/collection-view";
import type { ProductSort } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Karlaföt",
  description: "Notuð gæðaföt fyrir karla — skyrtur, buxur, yfirhafnir og fleira.",
};

export default async function KarlarPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  return (
    <CollectionView
      title="Karlar"
      description="Handvalin karlaföt á nýju lífi"
      filters={{ gender: "men", sort: (sort as ProductSort) ?? "newest" }}
    />
  );
}
