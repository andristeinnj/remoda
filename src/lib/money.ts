/**
 * ISK is stored as a plain integer (no minor units in practice).
 * formatISK(34900) -> "34.900 kr."
 */
const iskFormatter = new Intl.NumberFormat("is-IS", {
  style: "currency",
  currency: "ISK",
  maximumFractionDigits: 0,
});

export function formatISK(amount: number): string {
  return iskFormatter.format(amount);
}
