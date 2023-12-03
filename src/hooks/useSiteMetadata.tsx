// usePageData.ts
import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { q, makeSafeQueryRunner, InferType } from "groqd";

export const runQuery = makeSafeQueryRunner((query) => client.fetch(query));

const siteMetadataQuery = q("*", { isArray: true })
  .filter("_type == 'siteSettings'")
  .slice(0)
  .grab({
    siteTitle: q.string(),
    author: q.string(),
    description: q.string(),
    siteColors: q("siteColors")
      .deref()
      .grab({
        primary: q.object({
          hex: q.string(),
          rgb: q.object({
            r: q.number(),
            g: q.number(),
            b: q.number()
          })
        })
      }),
    socialLinks: q("socialLinks")
  });
type SanitySiteMetadata = InferType<typeof siteMetadataQuery>;

export function useSiteMetadata(): { siteMetadata: SanitySiteMetadata | undefined } {
  const [siteMetadata, setSiteMetadata] = useState<SanitySiteMetadata>();

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
