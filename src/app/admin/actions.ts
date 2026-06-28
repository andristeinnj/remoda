"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

async function assertAdmin() {
  const user = await getSessionUser();
  if (!user?.isAdmin) throw new Error("Aðgangur ekki heimilaður.");
  return user;
}

const productSchema = z.object({
  title: z.string().min(1, "Vantar titil."),
  description: z.string().optional(),
  brand: z.string().optional(),
  gender: z.enum(["women", "men", "unisex"]),
  category: z.string().min(1),
  size: z.string().optional(),
  color: z.string().optional(),
  condition: z.enum(["new_with_tags", "excellent", "good", "fair"]),
  price_isk: z.coerce.number().int().min(0),
  original_price_isk: z.coerce.number().int().min(0).optional(),
  status: z.enum(["available", "reserved", "sold"]),
  published: z.boolean(),
});

function parseMeasurements(raw: string | null): Record<string, string> {
  if (!raw) return {};
  const out: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const [k, ...rest] = line.split(":");
    if (k && rest.length) out[k.trim()] = rest.join(":").trim();
  }
  return out;
}

async function uploadImages(
  productId: string,
  files: File[],
  startPosition: number
) {
  const supabase = createSupabaseAdminClient();
  let position = startPosition;
  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${productId}/${randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      console.error("image upload failed", error.message);
      continue;
    }
    await supabase
      .from("product_images")
      .insert({ product_id: productId, storage_path: path, position });
    position++;
  }
}

export async function createProduct(formData: FormData) {
  await assertAdmin();
  const parsed = productSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    brand: formData.get("brand") || undefined,
    gender: formData.get("gender"),
    category: formData.get("category"),
    size: formData.get("size") || undefined,
    color: formData.get("color") || undefined,
    condition: formData.get("condition"),
    price_isk: formData.get("price_isk"),
    original_price_isk: formData.get("original_price_isk") || undefined,
    status: formData.get("status") ?? "available",
    published: formData.get("published") === "on",
  });

  const supabase = createSupabaseAdminClient();
  const slug = `${slugify(parsed.title)}-${randomUUID().slice(0, 6)}`;

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...parsed,
      slug,
      measurements: parseMeasurements(formData.get("measurements") as string),
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  await uploadImages(data.id, files, 0);

  revalidatePath("/admin");
  return { id: data.id };
}

export async function updateProduct(id: string, formData: FormData) {
  await assertAdmin();
  const parsed = productSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    brand: formData.get("brand") || undefined,
    gender: formData.get("gender"),
    category: formData.get("category"),
    size: formData.get("size") || undefined,
    color: formData.get("color") || undefined,
    condition: formData.get("condition"),
    price_isk: formData.get("price_isk"),
    original_price_isk: formData.get("original_price_isk") || undefined,
    status: formData.get("status"),
    published: formData.get("published") === "on",
  });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("products")
    .update({
      ...parsed,
      measurements: parseMeasurements(formData.get("measurements") as string),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  const { count } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true })
    .eq("product_id", id);
  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  await uploadImages(id, files, count ?? 0);

  revalidatePath("/admin");
  revalidatePath(`/admin/vorur/${id}`);
}

export type SaveResult =
  | { ok: true; redirect: string }
  | { ok: false; error: string };

export async function saveNewProduct(formData: FormData): Promise<SaveResult> {
  try {
    await createProduct(formData);
    return { ok: true, redirect: "/admin" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Villa kom upp." };
  }
}

export async function saveExistingProduct(
  id: string,
  formData: FormData
): Promise<SaveResult> {
  try {
    await updateProduct(id, formData);
    return { ok: true, redirect: "/admin" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Villa kom upp." };
  }
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.storage.from("product-images").remove([`${id}`]);
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteProductImage(imageId: string, productId: string) {
  await assertAdmin();
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("id", imageId)
    .single();
  if (data?.storage_path) {
    await supabase.storage.from("product-images").remove([data.storage_path]);
  }
  await supabase.from("product_images").delete().eq("id", imageId);
  revalidatePath(`/admin/vorur/${productId}`);
}
