"use client";

import Link from "next/link";
import { useLocale } from "../context/LocaleContext";

export function LanguageSwitcher() {
  const { alternatePath, otherLocale } = useLocale();
  return (
    <Link
      className="flex flex-row justify-end gap-2 text-lg font-bold no-underline uppercase rounded-full link hover:text-accent"
      href={alternatePath}
      hrefLang={otherLocale}
      lang={otherLocale}
      aria-label={`Switch language to ${otherLocale === "fr" ? "French" : "English"}`}
    >
      {otherLocale}
    </Link>
  );
}
