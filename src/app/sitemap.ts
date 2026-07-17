import type { MetadataRoute } from "next";

import { localizePath } from "@/i18n/config";
import { getSiteUrl } from "@/lib/metadata";
import { getAlbumSlugs, getCategorySlugs, getPageSlugs, getPostSlugs } from "@/sanity/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [albums, categories, pages, posts] = await Promise.all([
    getAlbumSlugs(),
    getCategorySlugs(),
    getPageSlugs(),
    getPostSlugs()
  ]);
  const routes = ["/", "/gallery", "/blog", "/album/all", "/album/featured"];
  const urls = new Set<string>();

  for (const route of routes) {
    urls.add(localizePath(route, "en"));
    urls.add(localizePath(route, "fr"));
  }
  for (const { slug } of albums) {
    urls.add(`/album/${slug}`);
    urls.add(`/fr/album/${slug}`);
  }
  for (const { slug } of categories) {
    urls.add(`/category/${slug}`);
    urls.add(`/fr/category/${slug}`);
  }
  for (const page of pages) urls.add(localizePath(`/${page.slug}`, page.language));
  for (const post of posts) {
    if (post.slug) urls.add(`/blog/${post.slug}`);
    if (post.slugFr) urls.add(`/fr/blog/${post.slugFr}`);
  }

  return Array.from(urls).map((path) => ({ url: new URL(path, getSiteUrl()).toString() }));
}
