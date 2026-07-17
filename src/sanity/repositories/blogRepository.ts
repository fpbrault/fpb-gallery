import "server-only";

import {
  mapLatestPost,
  mapPostList,
  mapPostPage,
  mapPostSummaries
} from "@/features/blog/blogMapper";
import type { Locale } from "@/i18n/config";
import { encodeBlogCursor } from "@/lib/pagination";
import { getSanityClient } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import {
  LATEST_POST_QUERY,
  POST_CURSOR_QUERY,
  POST_LIST_QUERY,
  POST_QUERY,
  POST_SLUGS_QUERY
} from "@/sanity/queries";
import { runSanityRequest } from "@/sanity/repositories/runSanityRequest";

export async function getPosts(locale: Locale, limit = 3) {
  return runSanityRequest("post-list", async () => {
    const { data } = await sanityFetch({
      query: POST_LIST_QUERY,
      params: { locale, limit },
      tags: ["posts"]
    });
    const result = mapPostList(data);
    return { ...result, nextCursor: getNextCursor(result.posts) };
  });
}

export async function getPostsAfter(
  locale: Locale,
  cursor: { id: string; publishDate: string },
  limit: number
) {
  return runSanityRequest("post-cursor", async () => {
    const { data } = await sanityFetch({
      query: POST_CURSOR_QUERY,
      params: { locale, cursorDate: cursor.publishDate, cursorId: cursor.id, limit },
      tags: ["posts"]
    });
    return mapPostSummaries(data);
  });
}

export function getNextCursor(posts: Array<{ id: string; publishDate: string | null }>) {
  const lastPost = posts.at(-1);
  return lastPost?.publishDate
    ? encodeBlogCursor({ id: lastPost.id, publishDate: lastPost.publishDate })
    : null;
}

export async function getLatestPost(locale: Locale) {
  return runSanityRequest("latest-post", async () => {
    const { data } = await sanityFetch({
      query: LATEST_POST_QUERY,
      params: { locale },
      tags: ["posts"]
    });
    return mapLatestPost(data);
  });
}

export async function getPost(slug: string, locale: Locale) {
  return runSanityRequest("post", async () => {
    const { data } = await sanityFetch({
      query: POST_QUERY,
      params: { slug, locale },
      tags: ["posts"]
    });
    return mapPostPage(data);
  });
}

export async function getPostSlugs() {
  return runSanityRequest("post-slugs", async () => {
    const rows = await getSanityClient().fetch(POST_SLUGS_QUERY);
    return rows.map(({ slug, slugFr }) => ({
      slug: slug ?? undefined,
      slugFr: slugFr ?? undefined
    }));
  });
}
