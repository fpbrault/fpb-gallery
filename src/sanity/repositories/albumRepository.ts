import "server-only";

import {
  mapAlbum,
  mapAlbums,
  mapCategories,
  mapImageCollection
} from "@/features/albums/albumMapper";
import type { Locale } from "@/i18n/config";
import { getSanityClient } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import {
  ALBUM_QUERY,
  ALBUM_SLUGS_QUERY,
  ALL_IMAGES_QUERY,
  CATEGORY_INDEX_QUERY,
  CATEGORY_QUERY,
  CATEGORY_SLUGS_QUERY,
  FEATURED_IMAGES_QUERY
} from "@/sanity/queries";
import { runSanityRequest } from "@/sanity/repositories/runSanityRequest";

export async function getCategories() {
  return runSanityRequest("categories", async () => {
    const { data } = await sanityFetch({
      query: CATEGORY_INDEX_QUERY,
      tags: ["categories", "albums"]
    });
    return mapCategories(data);
  });
}

export async function getCategory(slug: string) {
  return runSanityRequest("category", async () => {
    const { data } = await sanityFetch({
      query: CATEGORY_QUERY,
      params: { slug },
      tags: ["categories", "albums"]
    });
    return mapAlbums(data);
  });
}

export async function getCategorySlugs() {
  return runSanityRequest("category-slugs", async () => {
    const rows = await getSanityClient().fetch(CATEGORY_SLUGS_QUERY);
    return rows.flatMap(({ slug }) => (slug ? [{ slug }] : []));
  });
}

export async function getAlbum(slug: string, locale: Locale) {
  return runSanityRequest("album", async () => {
    const { data } = await sanityFetch({
      query: ALBUM_QUERY,
      params: { locale, slug },
      tags: ["albums"]
    });
    return mapAlbum(data);
  });
}

export async function getAlbumSlugs() {
  return runSanityRequest("album-slugs", async () => {
    const rows = await getSanityClient().fetch(ALBUM_SLUGS_QUERY);
    return rows.flatMap(({ slug }) => (slug ? [{ slug }] : []));
  });
}

export async function getAllImages() {
  return runSanityRequest("all-images", async () => {
    const { data } = await sanityFetch({ query: ALL_IMAGES_QUERY, tags: ["albums"] });
    return mapImageCollection(data);
  });
}

export async function getFeaturedImages() {
  return runSanityRequest("featured-images", async () => {
    const { data } = await sanityFetch({ query: FEATURED_IMAGES_QUERY, tags: ["albums"] });
    return mapImageCollection(data);
  });
}
