"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Þú þarft að vera skráð(ur) inn.");
  return user;
}

function genTagToken() {
  return `RM${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

const profileSchema = z.object({
  full_name: z.string().min(1),
  phone: z.string().optional(),
  kennitala: z.string().optional(),
  iban: z.string().optional(),
  bank_name: z.string().optional(),
  address: z.string().optional(),
  postcode: z.string().optional(),
  city: z.string().optional(),
});

export async function saveSellerProfile(formData: FormData) {
  const user = await requireUser();
  const parsed = profileSchema.parse(Object.fromEntries(formData));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ ...parsed, is_seller: true })
    .eq("id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/seljandi");
}

const itemSchema = z.object({
  title: z.string().min(1, "Vantar titil."),
  description: z.string().optional(),
  brand: z.string().optional(),
  gender: z.enum(["women", "men", "unisex"]),
  category: z.string().min(1),
  size: z.string().optional(),
  color: z.string().optional(),
  condition: z.enum(["new_with_tags", "excellent", "good", "fair"]),
  proposed_price_isk: z.coerce.number().int().min(0),
  photos_by: z.enum(["admin", "seller"]),
});

export type RegisterItemResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function registerItem(formData: FormData): Promise<RegisterItemResult> {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Villa." };
  }

  const parsedResult = itemSchema.safeParse(Object.fromEntries(formData));
  if (!parsedResult.success) {
    return { ok: false, error: parsedResult.error.issues[0]?.message ?? "Ógild gögn." };
  }
  const data = parsedResult.data;

  const supabase = await createSupabaseServerClient();
  const slug = `${slugify(data.title)}-${randomUUID().slice(0, 6)}`;

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      seller_id: user.id,
      title: data.title,
      description: data.description ?? null,
      brand: data.brand ?? null,
      gender: data.gender,
      category: data.category,
      size: data.size ?? null,
      color: data.color ?? null,
      condition: data.condition,
      proposed_price_isk: data.proposed_price_isk,
      price_isk: data.proposed_price_isk,
      photos_by: data.photos_by,
      slug,
      qr_token: genTagToken(),
      intake_status: "awaiting_reception",
      status: "available",
      published: false,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  revalidatePath("/seljandi");
  return { ok: true, id: product.id };
}

/** Seller uploads photos for their own item (verified, then stored via service role). */
export async function addSellerPhotos(productId: string, formData: FormData) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, seller_id")
    .eq("id", productId)
    .maybeSingle();
  if (!product || product.seller_id !== user.id) {
    throw new Error("Aðgangur ekki heimilaður.");
  }

  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("product_images")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);
  let position = count ?? 0;

  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${productId}/${randomUUID()}.${ext}`;
    const { error } = await admin.storage
      .from("product-images")
      .upload(path, file, { contentType: file.type });
    if (error) continue;
    await admin
      .from("product_images")
      .insert({ product_id: productId, storage_path: path, position });
    position++;
  }
  revalidatePath(`/seljandi/vara/${productId}`);
}

export async function deleteSellerItem(productId: string) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  // RLS allows delete only on own non-listed items via seller_update? Deletes need a policy;
  // verify ownership + status, then delete via service role.
  const { data: product } = await supabase
    .from("products")
    .select("id, seller_id, intake_status")
    .eq("id", productId)
    .maybeSingle();
  if (!product || product.seller_id !== user.id) throw new Error("Aðgangur ekki heimilaður.");
  if (product.intake_status !== "awaiting_reception") {
    throw new Error("Aðeins hægt að eyða vörum sem eru ekki komnar til okkar.");
  }
  const admin = createSupabaseAdminClient();
  await admin.from("products").delete().eq("id", productId);
  revalidatePath("/seljandi");
}
