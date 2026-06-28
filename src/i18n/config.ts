export const locales = ["is", "en", "es", "pl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "is";

export const localeNames: Record<Locale, string> = {
  is: "Íslenska",
  en: "English",
  es: "Español",
  pl: "Polski",
};

/** ISO 3166-1 alpha-2 country code for each locale's flag (svg in /public/flags). */
export const localeCountry: Record<Locale, string> = {
  is: "is",
  en: "gb",
  es: "es",
  pl: "pl",
};

export const LOCALE_COOKIE = "locale";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
