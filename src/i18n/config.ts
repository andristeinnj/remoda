export const locales = ["is", "en", "es", "pl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "is";

export const localeNames: Record<Locale, string> = {
  is: "Íslenska",
  en: "English",
  es: "Español",
  pl: "Polski",
};

export const localeFlags: Record<Locale, string> = {
  is: "🇮🇸",
  en: "🇬🇧",
  es: "🇪🇸",
  pl: "🇵🇱",
};

export const LOCALE_COOKIE = "locale";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
