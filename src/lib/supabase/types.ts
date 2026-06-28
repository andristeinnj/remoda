// Hand-authored to mirror supabase/migrations/0001_init.sql.
// Once the live project exists, regenerate with:
//   supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts

export type ProductStatus = "available" | "reserved" | "sold";
export type ProductGender = "women" | "men" | "unisex";
export type ProductCondition = "new_with_tags" | "excellent" | "good" | "fair";
export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "shipped"
  | "cancelled";

export type ProductRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  brand: string | null;
  gender: ProductGender;
  category: string;
  size: string | null;
  color: string | null;
  condition: ProductCondition;
  measurements: Record<string, string>;
  price_isk: number;
  original_price_isk: number | null;
  status: ProductStatus;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  storage_path: string;
  alt: string | null;
  position: number;
};

export type OrderRow = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_email: string;
  customer_name: string;
  phone: string | null;
  status: OrderStatus;
  subtotal_isk: number;
  shipping_isk: number;
  total_isk: number;
  dropp_location_id: string | null;
  dropp_location_name: string | null;
  dropp_barcode: string | null;
  teya_payment_ref: string | null;
  created_at: string;
  paid_at: string | null;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  title_snapshot: string;
  brand_snapshot: string | null;
  size_snapshot: string | null;
  price_isk_snapshot: number;
};

export type ProductWithImages = ProductRow & {
  product_images: ProductImageRow[];
};
