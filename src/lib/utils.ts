import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build a URL-safe slug from Icelandic/Latin text. */
export function slugify(input: string): string {
  const map: Record<string, string> = {
    á: "a", é: "e", í: "i", ó: "o", ú: "u", ý: "y",
    þ: "th", æ: "ae", ö: "o", ð: "d",
  };
  return input
    .toLowerCase()
    .replace(/[áéíóúýþæöð]/g, (c) => map[c] ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
