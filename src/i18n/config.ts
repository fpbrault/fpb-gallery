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
  // The proxy rewrites unprefixed English URLs internally to /en/..., so
  // client components can observe either public (/gallery) or internal
  // (/en/gallery) pathnames. Normalize both locale prefixes before applying
  // the requested public locale.
  const withoutLocale = normalized.replace(/^\/(?:en|fr)(?=\/|$)/, "") || "/";
  return locale === "fr" ? `/fr${withoutLocale === "/" ? "" : withoutLocale}` : withoutLocale;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "fr" : "en";
}
