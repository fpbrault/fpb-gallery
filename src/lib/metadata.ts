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
  description = site.description,
  localizedPaths,
  ogImage
}: {
  locale: Locale;
  path: string;
  site: SiteMetadata;
  title: string;
  description?: string;
  localizedPaths?: Partial<Record<Locale, string>>;
  ogImage?: { type: "album" | "post"; id: string };
}): Metadata {
  const localizedPath = localizePath(localizedPaths?.[locale] ?? path, locale);
  const canonical = new URL(localizedPath, getSiteUrl());
  const fullTitle = title === site.siteTitle ? title : `${site.siteTitle} - ${title}`;
  const imageUrl = new URL("/api/og", getSiteUrl());
  imageUrl.searchParams.set("title", title);
  if (ogImage) imageUrl.searchParams.set(`${ogImage.type}Id`, ogImage.id);

  const languages = Object.fromEntries(
    (["en", "fr"] as const).flatMap((candidateLocale) => {
      const candidatePath = localizedPaths
        ? localizedPaths[candidateLocale]
        : localizePath(path, candidateLocale);
      return candidatePath
        ? [[candidateLocale, new URL(localizePath(candidatePath, candidateLocale), getSiteUrl())]]
        : [];
    })
  );

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
      languages
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      url: canonical,
      title: fullTitle,
      description,
      images: [{ url: imageUrl }]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl]
    }
  };
}
