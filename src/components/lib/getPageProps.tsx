import { getBasePageProps } from "./getBasePageProps";
import { getPageData } from "./getPageData";

/**
 * Fetches page properties.
 *
 * @param {any} query - The query for fetching page data.
 * @param {any} context - The context object.
 * @returns {Promise<{ props: { data: any, preview: any, previewToken: any, siteMetadata: any, headerData: any, context: any }, revalidate: number }>} The page properties with context.
 */

export async function getPageProps(query: any, context: any) {
  const { ctx, preview, previewToken, siteMetadata, headerData } = await getBasePageProps(context);
  try {
    const { data } = await getPageData(query, ctx, previewToken);


    return {
      props: { data, preview, previewToken, siteMetadata, headerData, context: ctx },
      revalidate: 3600
    };
  }
  catch (error) {
    console.log("error")
    return {
      props: { data: null, preview, previewToken, siteMetadata, headerData, context: ctx },
      revalidate: 3600
    };
  }
}
