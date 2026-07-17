import "server-only";

import { mapHeaderData, mapSiteMetadata } from "@/features/site/siteMapper";
import type { Locale } from "@/i18n/config";
import { sanityFetch } from "@/sanity/lib/live";
import { HEADER_QUERY, SITE_METADATA_QUERY } from "@/sanity/queries";
import { runSanityRequest } from "@/sanity/repositories/runSanityRequest";

export async function getSiteShellData(locale: Locale) {
  return runSanityRequest("site-shell", async () => {
    const [siteResult, headerResult] = await Promise.all([
      sanityFetch({ query: SITE_METADATA_QUERY, tags: ["site-settings"] }),
      sanityFetch({ query: HEADER_QUERY, tags: ["navigation"] })
    ]);

    return {
      siteMetadata: mapSiteMetadata(siteResult.data),
      headerData: mapHeaderData(headerResult.data, locale)
    };
  });
}
