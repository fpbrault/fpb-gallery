import type { Metadata } from "next";

import { localizePath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { SiteMetadata } from "@/features/site/models";

export function getSiteUrl(): URL {
  const value = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fpbrault.com";
  return new URL(value.startsWith("http") ? value : `https://${value}`);
}

export function createPageMetadata({
  locale,
  path,
  site,
  title,
  description = site.description
}: {
  locale: Locale;
  path: string;
  site: SiteMetadata;
  title: string;
  description?: string;
}): Metadata {
  const localizedPath = localizePath(path, locale);
  const canonical = new URL(localizedPath, getSiteUrl());
  const fullTitle = title === site.siteTitle ? title : `${site.siteTitle} - ${title}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
      languages: {
        en: new URL(localizePath(path, "en"), getSiteUrl()),
        fr: new URL(localizePath(path, "fr"), getSiteUrl())
      }
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      url: canonical,
      title: fullTitle,
      description,
      images: [{ url: new URL(`/api/og?title=${encodeURIComponent(title)}`, getSiteUrl()) }]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [new URL(`/api/og?title=${encodeURIComponent(title)}`, getSiteUrl())]
    }
  };
}
