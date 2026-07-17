import en from "../../public/locales/en/common.json";
import fr from "../../public/locales/fr/common.json";

export type Locale = "en" | "fr";

export const locales: Locale[] = ["en", "fr"];
export const defaultLocale: Locale = "en";

export const dictionaries = { en, fr } as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizePath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withoutLocale = normalized.replace(/^\/fr(?=\/|$)/, "") || "/";
  return locale === "fr" ? `/fr${withoutLocale === "/" ? "" : withoutLocale}` : withoutLocale;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "fr" : "en";
}
