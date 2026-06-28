/**
 * Shipping with Dropp. Flat fee to a chosen pickup point, free over a threshold.
 * Adjust once real Dropp pricing is confirmed.
 */
export const SHIPPING_ISK = 990;
export const FREE_SHIPPING_THRESHOLD_ISK = 15000;

export function shippingFor(subtotalISK: number): number {
  if (subtotalISK <= 0) return 0;
  return subtotalISK >= FREE_SHIPPING_THRESHOLD_ISK ? 0 : SHIPPING_ISK;
}
