import { converter, parse } from "culori";

import type { HeaderData, SiteMetadata } from "@/features/site/models";
import type { Locale } from "@/i18n/config";
import type { HEADER_QUERY_RESULT, SITE_METADATA_QUERY_RESULT } from "@/sanity/sanity.types";

type ThemeDocument = NonNullable<
  NonNullable<SITE_METADATA_QUERY_RESULT>["customThemes"]["darkTheme"]
>;

function themeVariables(theme: ThemeDocument | null): Record<string, string> | undefined {
  if (!theme) return undefined;
  const toOklch = converter("oklch");
  const variables: Record<string, string> = {};

  for (const [name, color] of Object.entries(theme)) {
    if (!color?.hex) continue;
    const converted = toOklch(parse(color.hex));
    if (!converted) continue;
    variables[`--${name}`] = `${converted.l} ${converted.c} ${converted.h ?? 0}`;
  }

  return Object.keys(variables).length ? variables : undefined;
}

export function mapSiteMetadata(input: SITE_METADATA_QUERY_RESULT): SiteMetadata {
  return {
    author: input?.author ?? "Felix Perron-Brault",
    description: input?.description ?? "Photography portfolio",
    siteTitle: input?.siteTitle ?? "Felix Perron-Brault Photographe",
    socialLinks: (input?.socialLinks ?? []).flatMap((link) =>
      link.name && link.type && link.url
        ? [{ name: link.name, type: link.type, url: link.url }]
        : []
    ),
    themes: {
      darkThemeName: input?.themes.darkThemeName ?? "mytheme",
      lightThemeName: input?.themes.lightThemeName ?? "light"
    },
    customFont: input?.customFont ?? undefined,
    customDisplayFont: input?.customDisplayFont ?? undefined,
    customThemeVariables: {
      dark: themeVariables(input?.customThemes.darkTheme ?? null),
      light: themeVariables(input?.customThemes.lightTheme ?? null)
    }
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
