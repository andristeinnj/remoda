import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { saveExistingProduct } from "@/app/admin/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ProductWithImages } from "@/lib/supabase/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(id, product_id, storage_path, alt, position)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const product = data as ProductWithImages;
  product.product_images?.sort((a, b) => a.position - b.position);

  const action = saveExistingProduct.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Breyta vöru</h1>
          <p className="text-sm text-muted-foreground">{product.title}</p>
        </div>
        <DeleteProductButton id={id} />
      </div>
      <div className="mt-6">
        <ProductForm product={product} action={action} />
      </div>
    </div>
  );
}
