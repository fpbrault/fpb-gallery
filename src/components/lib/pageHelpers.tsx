import { getSlugFromContext } from "./utils";
import { getClient } from "@/sanity/lib/client";
import { makeSafeQueryRunner, q, InferType } from "groqd";
import { getHeaderData } from "@/components/lib/getHeaderData";
import { parse, converter } from "culori";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


export const siteMetadataQuery = q("*", { isArray: true })
  .filter("_type == 'siteSettings'")
  .slice(0)
  .grab({
    siteTitle: q.string(),
    description: q.string(),
    author: q.string(),
    customFont: q.string(),
    customDisplayFont: q.string(),

    themes: q("").grab({
      darkThemeName: q.string(),
      lightThemeName: q.string()
    }),
    customThemes: q("").grab({
      darkTheme: q("customDarkTheme").deref(),
      lightTheme: q("customLightTheme").deref()
    }),
    socialLinks: q("socialLinks")
  });

export type SiteMetadata = InferType<typeof siteMetadataQuery>;

export interface CustomSiteMetadata extends SiteMetadata {
  customThemeVariables?: {
    customDarkThemeVariables?: any;
    customLightThemeVariables?: any;
  } | null;
}
interface Theme {
  [key: string]: string; // This is a string index signature
}

function generateCustomTheme(themeData: any) {
  try {
    delete themeData["_rev"];
    delete themeData["_createdAt"];
    delete themeData["_id"];
    delete themeData["_type"];
    delete themeData["_updatedAt"];
    delete themeData["_id"];

    const oklch = converter("oklch");

    const theme: Theme = {};

    if (themeData) {
      // Set CSS variables based on custom theme colors
      Object.keys(themeData).forEach((colorKey) => {
        const colorValue = themeData[colorKey];
        const hexColor = parse(colorValue.hex);
        const oklchColor = oklch(hexColor);
        const colorCode =
          (oklchColor?.l ?? 0) + " " + (oklchColor?.c ?? 0) + " " + (oklchColor?.h ?? 0);
        theme["--" + colorKey] = colorCode;
      });
    }
    return theme;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getBasePageProps(context: any) {

  const preview = context.draftMode || false;
  const previewToken = (preview && process.env.SANITY_API_READ_TOKEN) ?? "";
  const client = getClient(previewToken);
  
  const runQuery = makeSafeQueryRunner((query) => client.fetch(query));
  const headerData = await getHeaderData();
  let siteMetadata: CustomSiteMetadata = {
    customThemeVariables: null,
    description: "",
    siteTitle: "",
    author: "",
    customFont: "",
    customDisplayFont: "",
    themes: {
      darkThemeName: "",
      lightThemeName: ""
    },
    customThemes: {
      darkTheme: {},
      lightTheme: {}
    },
  }
  try {
    siteMetadata = {
      ...await runQuery(siteMetadataQuery),
      customThemeVariables: null,
    };
  } catch (error) {
    console.error(error)
  }

  try {
    const customDarkThemeVariables =
      siteMetadata.customThemes?.darkTheme &&
      generateCustomTheme(siteMetadata.customThemes?.darkTheme);
    const customLightThemeVariables =
      siteMetadata.customThemes?.lightTheme &&
      generateCustomTheme(siteMetadata.customThemes?.lightTheme);

    if (customDarkThemeVariables || customLightThemeVariables) {
      siteMetadata.customThemeVariables = {};
      siteMetadata.customThemeVariables.customDarkThemeVariables = customDarkThemeVariables;
      siteMetadata.customThemeVariables.customLightThemeVariables = customLightThemeVariables;
    }
  } catch (error) {
    console.error(error);
  }

  if (context?.params) {
    context.params.locale = context?.locale;
  } else {
    context = { ...context, params: {} };
  }

  return {
    ...await getTranslations(context),
    context,
    preview,
    previewToken,
    siteMetadata,
    headerData
  };
}

export const getTranslations = async (context: any) => {
  const _nextI18Next = {...(await serverSideTranslations(context.locale ?? "en", ["common", "footer"]))}
  return _nextI18Next
}

export async function handleLocaleRedirect(data: any, context: any, prefix?: string) {
  try {

    const slug = getSlugFromContext(context);

    const { currentLocale } = getPageLocales(data, context, prefix == 'blog/');

    if (currentLocale?.slug?.current && currentLocale?.slug?.current != slug) {
      return {
        redirect: {
          destination:
            `/${context?.locale != "en" ? context?.locale + "/" : ""}${prefix ?? ""}${currentLocale?.slug?.current}`,
          permanent: false
        }
      };
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}


export function getPageLocales(data: any, context: any, isSlug = false) {
  if (isSlug) {
    const slugName = context?.locale === "en" ? "slug" : "slug_fr";
    const currentLocale = { slug: data?.current[slugName] };
    const otherLocale = {
      slug: data?.current[slugName === "slug" ? "slug_fr" : "slug"]
    };

    return { currentLocale, otherLocale };
  }

  const otherLocale =
    data?._translations?.find(
      (translation: { language: string }) => translation?.language != context?.locale
    ) ?? null;
  const currentLocale =
    data?._translations?.find(
      (translation: { language: string }) => translation?.language == context?.locale
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


