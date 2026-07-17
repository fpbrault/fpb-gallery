import "server-only";

import { mapPage } from "@/features/pages/pageMapper";
import type { Locale } from "@/i18n/config";
import { getSanityClient } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from "@/sanity/queries";
import { runSanityRequest } from "@/sanity/repositories/runSanityRequest";

export async function getPage(slug: string, locale: Locale) {
  return runSanityRequest("page", async () => {
    const { data } = await sanityFetch({
      query: PAGE_QUERY,
      params: { slug, locale },
      tags: ["pages"]
    });
    return mapPage(data);
  });
}

export async function getPageSlugs() {
  return runSanityRequest("page-slugs", async () => {
    const rows = await getSanityClient().fetch(PAGE_SLUGS_QUERY);
    return rows.flatMap(({ language, slug }) =>
      (language === "en" || language === "fr") && slug ? [{ language, slug }] : []
    );
  });
}
