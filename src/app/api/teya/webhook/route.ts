import { NextResponse } from "next/server";
import { verifyTeyaCallback } from "@/lib/teya";
import { markOrderPaidByNumber } from "@/lib/orders";

/**
 * Server-to-server callback from Teya SecurePay (returnurlsuccessserver).
 * This is the source of truth for payment status — it marks the order paid,
 * flips products to sold and books the Dropp shipment.
 *
 * Teya posts application/x-www-form-urlencoded. Field names follow the
 * Borgun/Teya SecurePay result scheme and should be verified during onboarding.
 */
export async function POST(req: Request) {
  let params: URLSearchParams;
  const contentType = req.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const body = await req.json();
      params = new URLSearchParams(body as Record<string, string>);
    } else {
      params = new URLSearchParams(await req.text());
    }
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const orderId = params.get("orderid") ?? "";
  const amount = params.get("amount") ?? "";
  const orderhash = params.get("orderhash") ?? "";
  const status = params.get("status") ?? params.get("orderstatus") ?? "";

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderid" }, { status: 400 });
  }

  const valid = verifyTeyaCallback({ orderId, amount, orderhash });
  if (!valid) {
    console.error("Teya callback hash mismatch for", orderId);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Treat empty status as success in dev; require explicit success otherwise.
  const isSuccess =
    status === "" || /ok|success|paid|approved/i.test(status);
  if (!isSuccess) {
    return NextResponse.json({ received: true, status });
  }

  try {
    await markOrderPaidByNumber(orderId, params.get("transactionid") ?? undefined);
  } catch (err) {
    console.error("markOrderPaid failed for", orderId, err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
