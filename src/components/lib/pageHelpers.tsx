import { getClient } from "@/sanity/lib/client";
import { getBasePageProps } from "./getBasePageProps";
import { getPageData } from "./getPageData";

export async function handleLocaleRedirect(currentLocale: any, context: any, prefix?: string) {
  try {
    if (currentLocale?.slug?.current && currentLocale?.slug?.current != context?.params?.slug) {
      return {
        redirect: {
          destination:
            "/" + (context.locale != "en" ? context.locale + "/" : null) + prefix ??
            "" + currentLocale?.slug?.current,
          permanent: false
        }
      };
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

export function getPageLocaleVersions(data: any, context: any, isSlug = false) {
  if (isSlug) {
    const slugName = context.locale === "en" ? "slug" : "slug_fr";
    const currentLocale = { slug: data.current[slugName] };
    const otherLocale = {
      slug: data.current[slugName === "slug" ? "slug_fr" : "slug"]
    };

    return { currentLocale, otherLocale };
  }

  const otherLocale =
    data?._translations?.find(
      (translation: { language: string }) => translation?.language != context.locale
    ) ?? null;
  const currentLocale =
    data?._translations?.find(
      (translation: { language: string }) => translation?.language == context.locale
    ) ?? null;

  return { otherLocale, currentLocale };
}

export function handlePageFetchError(error: unknown, redirectPath?: string) {
  console.error("Error fetching data:", error);

  return {
    redirect: {
      destination: redirectPath ?? "/",
      permanent: false
    }
  };
}

/**
 * Fetches page data with support for localization.
 *
 * @param {any} query - The query for fetching page data.
 * @param {any} context - The context object.
 * @param {boolean} isSlug - Indicates whether the localization is based on a slug.
 * @param {string | undefined} redirectPath - Optional. The path to redirect to if needed.
 * @returns {Promise<{ props: { data: any, preview: any, previewToken: any, siteMetadata: any, headerData: any, context: any }, revalidate: number }>} The page properties with context.
 */
export async function getLocalizedPageProps(query: any, context: any, isSlug: boolean, redirectPath?: string | undefined) {
  const { ctx, preview, previewToken, siteMetadata, headerData } =
    await getBasePageProps(context);
  const { data } = await getPageData(query, ctx, previewToken);


  const { currentLocale, otherLocale } = isSlug ? getPageLocaleVersions(data, ctx, true) : getPageLocaleVersions(data, ctx, false)
  handleLocaleRedirect(currentLocale, ctx, redirectPath);
  ctx.otherLocale = otherLocale;

  return {
    props: { data, preview, previewToken, siteMetadata, headerData, context: ctx },
    revalidate: 10
  };
}

/**
 * Fetches page properties.
 *
 * @param {any} query - The query for fetching page data.
 * @param {any} context - The context object.
 * @returns {Promise<{ props: { data: any, preview: any, previewToken: any, siteMetadata: any, headerData: any, context: any }, revalidate: number }>} The page properties with context.
 */
export async function getPageProps(query: any, context: any) {
  const { ctx, preview, previewToken, siteMetadata, headerData } =
    await getBasePageProps(context);
  const { data } = await getPageData(query, ctx, previewToken);

  return {
    props: { data, preview, previewToken, siteMetadata, headerData, context: ctx },
    revalidate: 10
  };

}