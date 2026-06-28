import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";
import { shippingFor } from "@/lib/shipping";
import { createDroppShipment } from "@/lib/dropp";

const RESERVATION_MINUTES = 15;

export type OrderSummary = {
  order_number: string;
  status: string;
  total_isk: number;
  shipping_isk: number;
  subtotal_isk: number;
  customer_name: string;
  dropp_location_name: string | null;
  items: { title: string; price: number }[];
};

export async function getOrderByNumber(
  orderNumber: string
): Promise<OrderSummary | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "order_number, status, total_isk, shipping_isk, subtotal_isk, customer_name, dropp_location_name, order_items(title_snapshot, price_isk_snapshot)"
    )
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (error || !data) return null;
  return {
    order_number: data.order_number,
    status: data.status,
    total_isk: data.total_isk,
    shipping_isk: data.shipping_isk,
    subtotal_isk: data.subtotal_isk,
    customer_name: data.customer_name,
    dropp_location_name: data.dropp_location_name,
    items: (data.order_items ?? []).map(
      (i: { title_snapshot: string; price_isk_snapshot: number }) => ({
        title: i.title_snapshot,
        price: i.price_isk_snapshot,
      })
    ),
  };
}

export type CheckoutCustomer = {
  name: string;
  email: string;
  phone?: string | null;
};

export type CreateOrderInput = {
  itemIds: string[];
  sessionId: string;
  customer: CheckoutCustomer;
  droppLocationId: string;
  droppLocationName: string;
  userId?: string | null;
};

export type CreateOrderResult = {
  orderId: string;
  orderNumber: string;
  totalISK: number;
};

type PurchasableProduct = {
  id: string;
  title: string;
  brand: string | null;
  size: string | null;
  price_isk: number;
};

/** Fetch the items being purchased and verify each is still available. */
async function loadAvailableItems(itemIds: string[]): Promise<PurchasableProduct[]> {
  if (!isSupabaseConfigured) {
    return SAMPLE_PRODUCTS.filter(
      (p) => itemIds.includes(p.id) && p.status === "available"
    ).map((p) => ({
      id: p.id,
      title: p.title,
      brand: p.brand,
      size: p.size,
      price_isk: p.price_isk,
    }));
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, title, brand, size, price_isk, status, published")
    .in("id", itemIds)
    .eq("status", "available")
    .eq("published", true);
  if (error) throw new Error(error.message);

  // Exclude anything with an active reservation.
  const { data: reserved } = await supabase
    .from("reservations")
    .select("product_id")
    .in("product_id", itemIds)
    .gt("expires_at", new Date().toISOString());
  const reservedIds = new Set((reserved ?? []).map((r) => r.product_id));

  return (data ?? [])
    .filter((p) => !reservedIds.has(p.id))
    .map((p) => ({
      id: p.id,
      title: p.title,
      brand: p.brand,
      size: p.size,
      price_isk: p.price_isk,
    }));
}

export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const items = await loadAvailableItems(input.itemIds);
  if (items.length === 0) {
    throw new Error("Engar af völdu vörunum eru lengur til sölu.");
  }

  const subtotal = items.reduce((sum, i) => sum + i.price_isk, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  if (!isSupabaseConfigured) {
    // Dev fallback: no persistence.
    return {
      orderId: `dev-${input.sessionId}`,
      orderNumber: `RM-DEV-${Date.now().toString().slice(-5)}`,
      totalISK: total,
    };
  }

  const supabase = createSupabaseAdminClient();

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: input.userId ?? null,
      customer_email: input.customer.email,
      customer_name: input.customer.name,
      phone: input.customer.phone ?? null,
      status: "pending",
      subtotal_isk: subtotal,
      shipping_isk: shipping,
      total_isk: total,
      dropp_location_id: input.droppLocationId,
      dropp_location_name: input.droppLocationName,
    })
    .select("id, order_number")
    .single();
  if (orderErr) throw new Error(orderErr.message);

  const { error: itemsErr } = await supabase.from("order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      product_id: i.id,
      title_snapshot: i.title,
      brand_snapshot: i.brand,
      size_snapshot: i.size,
      price_isk_snapshot: i.price_isk,
    }))
  );
  if (itemsErr) throw new Error(itemsErr.message);

  const expires = new Date(Date.now() + RESERVATION_MINUTES * 60_000).toISOString();
  await supabase.from("reservations").insert(
    items.map((i) => ({
      product_id: i.id,
      session_id: input.sessionId,
      order_id: order.id,
      expires_at: expires,
    }))
  );
  // Flag products as reserved for clarity in the admin view.
  await supabase
    .from("products")
    .update({ status: "reserved" })
    .in(
      "id",
      items.map((i) => i.id)
    );

  return {
    orderId: order.id,
    orderNumber: order.order_number,
    totalISK: total,
  };
}

/** Resolve an order's UUID from its human-facing number (e.g. "RM-1001"). */
export async function markOrderPaidByNumber(
  orderNumber: string,
  teyaRef?: string
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id")
    .eq("order_number", orderNumber)
    .single();
  if (error || !data) throw new Error("Pöntun fannst ekki.");
  await markOrderPaid(data.id, teyaRef);
}

/** Finalize a paid order: mark sold, clear reservations, book Dropp shipment. */
export async function markOrderPaid(
  orderId: string,
  teyaRef?: string
): Promise<void> {
  if (!isSupabaseConfigured) return; // dev fallback — nothing to persist

  const supabase = createSupabaseAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, customer_name, customer_email, phone, dropp_location_id"
    )
    .eq("id", orderId)
    .single();
  if (error || !order) throw new Error("Pöntun fannst ekki.");
  if (order.status === "paid" || order.status === "shipped") return; // idempotent

  const { data: items } = await supabase
    .from("order_items")
    .select("product_id")
    .eq("order_id", orderId);
  const productIds = (items ?? [])
    .map((i) => i.product_id)
    .filter((id): id is string => Boolean(id));

  // Book the Dropp shipment (best effort — never block marking paid).
  let barcode: string | null = null;
  try {
    if (order.dropp_location_id) {
      const shipment = await createDroppShipment({
        orderNumber: order.order_number,
        locationId: order.dropp_location_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        phone: order.phone,
      });
      barcode = shipment.barcode;
    }
  } catch (err) {
    console.error("Dropp booking failed for", order.order_number, err);
  }

  await supabase
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      teya_payment_ref: teyaRef ?? null,
      dropp_barcode: barcode,
    })
    .eq("id", orderId);

  if (productIds.length > 0) {
    await supabase.from("products").update({ status: "sold" }).in("id", productIds);
    await supabase.from("reservations").delete().in("product_id", productIds);
  }
}
