"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { dictionaries, getAlternateLocale, localizePath } from "@/i18n/config";
import type { Locale } from "@/sanity/types";

type TranslationKey =
  | "home.readPost"
  | "blog.previousPost"
  | "blog.nextPost"
  | "related.post"
  | "related.album"
  | "featuredHeader";

type LocaleContextValue = {
  alternatePath: string;
  locale: Locale;
  otherLocale: Locale;
  t: (key: TranslationKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readTranslation(locale: Locale, key: TranslationKey): string {
  const value = key.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[part];
  }, dictionaries[locale]);
  return typeof value === "string" ? value : key;
}

export function LocaleProvider({
  children,
  locale,
  alternatePath
}: {
  children: ReactNode;
  locale: Locale;
  alternatePath?: string;
}) {
  const pathname = usePathname();
  const otherLocale = getAlternateLocale(locale);

  return (
    <LocaleContext.Provider
      value={{
        alternatePath: alternatePath ?? localizePath(pathname ?? "/", otherLocale),
        locale,
        otherLocale,
        t: (key) => readTranslation(locale, key)
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
