import type { HeaderData, SiteMetadata } from "@/features/site/models";
import type { Locale } from "@/i18n/config";
import type { HEADER_QUERY_RESULT, SITE_METADATA_QUERY_RESULT } from "@/sanity/sanity.types";

export function mapSiteMetadata(input: SITE_METADATA_QUERY_RESULT): SiteMetadata {
  return {
    author: input?.author ?? "Felix Perron-Brault",
    description: input?.description ?? "Photography portfolio",
    siteTitle: input?.siteTitle ?? "Felix Perron-Brault Photographe",
    socialLinks: (input?.socialLinks ?? []).flatMap((link) =>
      link.name && link.type && link.url
        ? [{ name: link.name, type: link.type, url: link.url }]
        : []
    )
  };
}

export function mapHeaderData(input: HEADER_QUERY_RESULT, locale: Locale): HeaderData {
  const pages = (input?.pages ?? []).flatMap((page) => {
    if (page._type === "hardcodedPage") {
      const slug = locale === "fr" ? (page.slug_fr ?? page.slug) : page.slug;
      const title = locale === "fr" ? (page.title_fr ?? page.title) : page.title;
      return slug ? [{ slug, title: title ?? slug }] : [];
    }

    const translation = page.translations?.find((item) => item?.language === locale);
    const slug = translation?.slug ?? page.slug;
    const title = translation?.title ?? page.title;
    return slug ? [{ slug, title: title ?? slug }] : [];
  });

  return { pages, showHome: input?.showHome !== false };
}
