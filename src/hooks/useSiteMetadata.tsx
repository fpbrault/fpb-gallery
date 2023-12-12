// usePageData.ts
import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { makeSafeQueryRunner } from "groqd";
import { SiteMetadata, siteMetadataQuery } from "@/components/lib/pageHelpers";

export const runQuery = makeSafeQueryRunner((query) => client.fetch(query));

export function useSiteMetadata(): { siteMetadata: SiteMetadata | undefined } {
  const [siteMetadata, setSiteMetadata] = useState<SiteMetadata>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Now you can fetch your query's result, and validate the response, all in one.
        const data = await runQuery(siteMetadataQuery);

        setSiteMetadata(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return { siteMetadata };
}
