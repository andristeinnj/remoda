import "server-only";
import { createHash } from "node:crypto";

/**
 * Teya SecurePay (hosted payment page) integration.
 *
 * Teya's SecurePay in Iceland follows the Borgun SecurePay scheme: the merchant
 * POSTs a form to the hosted page with a SHA-256 `checkhash`, and Teya calls back
 * with a signed result. The exact field names / hash recipe must be confirmed with
 * the merchant's onboarding pack — they are isolated here.
 *
 * Until credentials are set, isTeyaConfigured is false and the checkout uses a
 * dev fallback that simulates a successful payment.
 */

const TEYA_MERCHANT_ID = process.env.TEYA_MERCHANT_ID;
const TEYA_PAYMENT_GATEWAY_ID = process.env.TEYA_PAYMENT_GATEWAY_ID;
const TEYA_SECRET = process.env.TEYA_SECRET;
const TEYA_MODE = process.env.TEYA_MODE ?? "test"; // "test" | "live"

export const isTeyaConfigured = Boolean(
  TEYA_MERCHANT_ID && TEYA_PAYMENT_GATEWAY_ID && TEYA_SECRET
);

const SECUREPAY_URL =
  TEYA_MODE === "live"
    ? "https://securepay.teya.is/securepay/"
    : "https://test.securepay.teya.is/securepay/";

const CURRENCY_ISK = "ISK";

export type TeyaCheckout = {
  actionUrl: string;
  fields: Record<string, string>;
};

function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/**
 * Build the hidden-form fields for the SecurePay hosted page.
 * `returnUrlServer` is the server-to-server callback (source of truth);
 * `returnUrlSuccess`/`returnUrlCancel` are where the shopper's browser lands.
 */
export function buildTeyaCheckout(params: {
  orderId: string;
  amountISK: number;
  returnUrlSuccess: string;
  returnUrlServer: string;
  returnUrlCancel: string;
}): TeyaCheckout {
  const amount = String(params.amountISK); // ISK has no minor units
  const checkhash = sha256Hex(
    `${TEYA_SECRET}${TEYA_MERCHANT_ID}${params.returnUrlSuccess}${params.returnUrlServer}${amount}${CURRENCY_ISK}`
  );

  return {
    actionUrl: SECUREPAY_URL,
    fields: {
      merchantid: TEYA_MERCHANT_ID!,
      paymentgatewayid: TEYA_PAYMENT_GATEWAY_ID!,
      checkhash,
      orderid: params.orderId,
      amount,
      currency: CURRENCY_ISK,
      language: "IS",
      returnurlsuccess: params.returnUrlSuccess,
      returnurlsuccessserver: params.returnUrlServer,
      returnurlcancel: params.returnUrlCancel,
    },
  };
}

/**
 * Verify the signed callback from Teya. Returns true if the order hash matches.
 * Field names follow the Borgun/Teya SecurePay result scheme.
 */
export function verifyTeyaCallback(params: {
  orderId: string;
  amount: string;
  orderhash: string;
}): boolean {
  if (!isTeyaConfigured) return true; // dev fallback
  const expected = sha256Hex(
    `${TEYA_SECRET}${params.orderId}${params.amount}${CURRENCY_ISK}`
  );
  return expected.toLowerCase() === params.orderhash.toLowerCase();
}
