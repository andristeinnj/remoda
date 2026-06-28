import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ProductGender, ProductWithImages } from "@/lib/supabase/types";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";

export type ProductSort = "newest" | "price-asc" | "price-desc";

export type ProductFilters = {
  gender?: ProductGender;
  category?: string;
  sale?: boolean;
  search?: string;
  sort?: ProductSort;
  includeSold?: boolean;
  limit?: number;
};

const IMAGE_SELECT =
  "*, product_images(id, product_id, storage_path, alt, position)";

export async function listProducts(
  filters: ProductFilters = {}
): Promise<ProductWithImages[]> {
  const { gender, category, sale, search, sort = "newest", includeSold = false, limit } =
    filters;

  if (!isSupabaseConfigured) {
    return filterSample(filters);
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase.from("products").select(IMAGE_SELECT).eq("published", true);

  if (gender) query = query.eq("gender", gender);
  if (category) query = query.eq("category", category);
  if (!includeSold) query = query.neq("status", "sold");
  if (sale) query = query.not("original_price_isk", "is", null);
  if (search) query = query.ilike("title", `%${search}%`);

  if (sort === "price-asc") query = query.order("price_isk", { ascending: true });
  else if (sort === "price-desc") query = query.order("price_isk", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("listProducts error", error.message);
    return [];
  }
  return (data as ProductWithImages[]).map(sortImages);
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithImages | null> {
  if (!isSupabaseConfigured) {
    return SAMPLE_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(IMAGE_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("getProductBySlug error", error.message);
    return null;
  }
  return data ? sortImages(data as ProductWithImages) : null;
}

function sortImages(p: ProductWithImages): ProductWithImages {
  p.product_images?.sort((a, b) => a.position - b.position);
  return p;
}

function filterSample(filters: ProductFilters): ProductWithImages[] {
  const { gender, category, sale, search, sort = "newest", includeSold = false, limit } =
    filters;
  let items = [...SAMPLE_PRODUCTS];
  if (gender) items = items.filter((p) => p.gender === gender);
  if (category) items = items.filter((p) => p.category === category);
  if (!includeSold) items = items.filter((p) => p.status !== "sold");
  if (sale) items = items.filter((p) => p.original_price_isk != null);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.brand ?? "").toLowerCase().includes(q)
    );
  }
  if (sort === "price-asc") items.sort((a, b) => a.price_isk - b.price_isk);
  else if (sort === "price-desc") items.sort((a, b) => b.price_isk - a.price_isk);
  else items.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return limit ? items.slice(0, limit) : items;
}
