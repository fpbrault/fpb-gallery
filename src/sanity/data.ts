import "server-only";

import type { QueryParams } from "@sanity/client";
import { converter, parse } from "culori";

import {
  ALBUM_QUERY,
  ALBUM_SLUGS_QUERY,
  ALL_IMAGES_QUERY,
  CATEGORY_INDEX_QUERY,
  CATEGORY_QUERY,
  CATEGORY_SLUGS_QUERY,
  FEATURED_IMAGES_QUERY,
  HEADER_QUERY,
  LATEST_POST_QUERY,
  PAGE_QUERY,
  PAGE_SLUGS_QUERY,
  POST_CURSOR_QUERY,
  POST_LIST_QUERY,
  POST_QUERY,
  POST_SLUGS_QUERY,
  SITE_METADATA_QUERY
} from "@/sanity/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { getSanityClient } from "@/sanity/lib/client";
import type {
  Album,
  AlbumSummary,
  CategorySummary,
  CustomPage,
  HeaderData,
  Locale,
  PostPage,
  PostSummary,
  SanityImage,
  SiteMetadata
} from "@/sanity/types";

async function fetchData<T>(query: string, params: QueryParams = {}, tags: string[] = []) {
  try {
    const { data } = await sanityFetch({ query, params, tags });
    return data as T;
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "sanity_fetch_error",
        message: error instanceof Error ? error.message : String(error),
        tags
      })
    );
    throw error;
  }
}

async function fetchBuildData<T>(query: string, params: QueryParams = {}) {
  try {
    return await getSanityClient().fetch<T>(query, params);
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "sanity_build_fetch_error",
        message: error instanceof Error ? error.message : String(error)
      })
    );
    throw error;
  }
}

type ThemeDocument = Record<string, { hex?: string } | null> | null;

function themeVariables(theme: ThemeDocument): Record<string, string> | undefined {
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

export async function getSiteShellData() {
  const [siteMetadata, headerData] = await Promise.all([
    fetchData<SiteMetadata>(SITE_METADATA_QUERY, {}, ["site-settings"]),
    fetchData<HeaderData>(HEADER_QUERY, {}, ["navigation"])
  ]);

  return {
    siteMetadata: {
      author: siteMetadata?.author ?? "Felix Perron-Brault",
      description: siteMetadata?.description ?? "Photography portfolio",
      siteTitle: siteMetadata?.siteTitle ?? "Felix Perron-Brault Photographe",
      socialLinks: siteMetadata?.socialLinks ?? [],
      themes: {
        darkThemeName: siteMetadata?.themes?.darkThemeName ?? "mytheme",
        lightThemeName: siteMetadata?.themes?.lightThemeName ?? "light"
      },
      customFont: siteMetadata?.customFont,
      customDisplayFont: siteMetadata?.customDisplayFont,
      customThemeVariables: {
        dark: themeVariables(
          (
            siteMetadata as SiteMetadata & {
              customThemes?: { darkTheme?: ThemeDocument };
            }
          )?.customThemes?.darkTheme ?? null
        ),
        light: themeVariables(
          (
            siteMetadata as SiteMetadata & {
              customThemes?: { lightTheme?: ThemeDocument };
            }
          )?.customThemes?.lightTheme ?? null
        )
      }
    } satisfies SiteMetadata,
    headerData: {
      pages: headerData?.pages ?? [],
      showHome: headerData?.showHome !== false
    } satisfies HeaderData
  };
}

export async function getCategories() {
  return fetchData<CategorySummary[]>(CATEGORY_INDEX_QUERY, {}, ["categories", "albums"]);
}

export async function getCategory(slug: string) {
  return fetchData<AlbumSummary[]>(CATEGORY_QUERY, { slug }, ["categories", "albums"]);
}

export async function getCategorySlugs() {
  return fetchBuildData<Array<{ slug: string }>>(CATEGORY_SLUGS_QUERY);
}

export async function getAlbum(slug: string, locale: Locale) {
  return fetchData<Album | null>(ALBUM_QUERY, { locale, slug }, ["albums"]);
}

export async function getAlbumSlugs() {
  return fetchBuildData<Array<{ slug: string }>>(ALBUM_SLUGS_QUERY);
}

export async function getAllImages() {
  return fetchData<SanityImage[]>(ALL_IMAGES_QUERY, {}, ["albums"]);
}

export async function getFeaturedImages() {
  return fetchData<SanityImage[]>(FEATURED_IMAGES_QUERY, {}, ["albums"]);
}

export async function getPosts(locale: Locale, limit = 3) {
  return fetchData<{ posts: PostSummary[]; totalCount: number }>(
    POST_LIST_QUERY,
    { locale, limit },
    ["posts"]
  );
}

export async function getPostsAfter(locale: Locale, cursor: string | null, limit: number) {
  return fetchData<PostSummary[]>(POST_CURSOR_QUERY, { locale, cursor, limit }, ["posts"]);
}

export async function getLatestPost(locale: Locale) {
  return fetchData<PostSummary | null>(LATEST_POST_QUERY, { locale }, ["posts"]);
}

export async function getPost(slug: string, locale: Locale) {
  return fetchData<PostPage | null>(POST_QUERY, { slug, locale }, ["posts"]);
}

export async function getPostSlugs() {
  return fetchBuildData<Array<{ slug?: string; slugFr?: string }>>(POST_SLUGS_QUERY);
}

export async function getPage(slug: string, locale: Locale) {
  return fetchData<CustomPage | null>(PAGE_QUERY, { slug, locale }, ["pages"]);
}

export async function getPageSlugs() {
  return fetchBuildData<Array<{ language: Locale; slug: string }>>(PAGE_SLUGS_QUERY);
}
