"use server";

import { z } from "zod";
import { createOrder, markOrderPaid } from "@/lib/orders";
import { buildTeyaCheckout, isTeyaConfigured } from "@/lib/teya";
import type { TeyaCheckout } from "@/lib/teya";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const schema = z.object({
  itemIds: z.array(z.string()).min(1, "Karfan er tóm."),
  sessionId: z.string().min(1),
  name: z.string().min(1, "Vantar nafn."),
  email: z.string().email("Ógilt netfang."),
  phone: z.string().optional(),
  droppLocationId: z.string().min(1, "Veldu afhendingarstað."),
  droppLocationName: z.string().min(1),
});

export type CheckoutResult =
  | { ok: false; error: string }
  | { ok: true; mode: "teya"; checkout: TeyaCheckout; orderNumber: string }
  | { ok: true; mode: "dev"; redirectUrl: string };

export async function startCheckout(
  input: z.infer<typeof schema>
): Promise<CheckoutResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ógild gögn." };
  }
  const data = parsed.data;

  let order;
  try {
    order = await createOrder({
      itemIds: data.itemIds,
      sessionId: data.sessionId,
      customer: { name: data.name, email: data.email, phone: data.phone },
      droppLocationId: data.droppLocationId,
      droppLocationName: data.droppLocationName,
    });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Ekki tókst að stofna pöntun.",
    };
  }

  if (isTeyaConfigured) {
    const checkout = buildTeyaCheckout({
      orderId: order.orderNumber,
      amountISK: order.totalISK,
      returnUrlSuccess: `${siteUrl}/kassi/stadfesting?order=${order.orderNumber}`,
      returnUrlServer: `${siteUrl}/api/teya/webhook`,
      returnUrlCancel: `${siteUrl}/kassi?cancelled=1`,
    });
    return { ok: true, mode: "teya", checkout, orderNumber: order.orderNumber };
  }

  // Dev fallback: no Teya credentials — simulate a successful payment.
  await markOrderPaid(order.orderId, "DEV-SIMULATED");
  return {
    ok: true,
    mode: "dev",
    redirectUrl: `/kassi/stadfesting?order=${order.orderNumber}&dev=1`,
  };
}
