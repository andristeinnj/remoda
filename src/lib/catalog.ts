/**
 * Shared catalog vocabulary (Icelandic-first labels).
 * The keys are stored in the database; the labels are shown in the UI.
 */

export type Gender = "women" | "men" | "unisex";
export type ProductStatus = "available" | "reserved" | "sold";
export type Condition = "new_with_tags" | "excellent" | "good" | "fair";

export const GENDERS: { key: Gender; label: string; slug: string }[] = [
  { key: "women", label: "Konur", slug: "konur" },
  { key: "men", label: "Karlar", slug: "karlar" },
  { key: "unisex", label: "Kynhlutlaust", slug: "kynhlutlaust" },
];

export const CATEGORIES: { key: string; label: string }[] = [
  { key: "dresses", label: "Kjólar" },
  { key: "tops", label: "Toppar & bolir" },
  { key: "knitwear", label: "Prjón & peysur" },
  { key: "outerwear", label: "Yfirhafnir" },
  { key: "pants", label: "Buxur" },
  { key: "skirts", label: "Pils" },
  { key: "shoes", label: "Skór" },
  { key: "bags", label: "Töskur" },
  { key: "accessories", label: "Fylgihlutir" },
];

export const CONDITIONS: { key: Condition; label: string; description: string }[] = [
  { key: "new_with_tags", label: "Nýtt með merkimiða", description: "Ónotað, með upprunalegum merkimiðum" },
  { key: "excellent", label: "Eins og nýtt", description: "Lítil sem engin notkunarmerki" },
  { key: "good", label: "Gott ástand", description: "Notað en vel með farið" },
  { key: "fair", label: "Ásættanlegt", description: "Sýnileg notkunarmerki" },
];

export const genderBySlug = (slug: string): Gender | undefined =>
  GENDERS.find((g) => g.slug === slug)?.key;

export const categoryLabel = (key: string): string =>
  CATEGORIES.find((c) => c.key === key)?.label ?? key;

export const conditionLabel = (key: string): string =>
  CONDITIONS.find((c) => c.key === key)?.label ?? key;

export const genderLabel = (key: string): string =>
  GENDERS.find((g) => g.key === key)?.label ?? key;
