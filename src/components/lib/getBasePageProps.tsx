import { getClient } from "@/sanity/lib/client";
import { makeSafeQueryRunner, q, InferType } from 'groqd';
import { getHeaderData } from "@/hooks/getHeaderData";
import { parse, converter } from 'culori'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


const siteMetadataQuery = q("*", { isArray: true })
  .filter("_type == 'siteSettings'")
  .slice(0)
  .grab({
    siteTitle: q.string(),
    author: q.string(),
    description: q.string(),
    themes:
      q("").grab({
        darkThemeName: q.string(),
        lightThemeName: q.string()
      }),
    customThemes: q("").grab({ darkTheme: q("customDarkTheme").deref(), lightTheme: q("customLightTheme").deref() }),
    socialLinks: q("socialLinks")
  });

export type SiteMetadata = InferType<typeof siteMetadataQuery>;

export interface CustomSiteMetadata extends SiteMetadata {
  customThemeVariables: {
    customDarkThemeVariables?: any,
    customLightThemeVariables?: any
  }
}
interface Theme {
  [key: string]: string; // This is a string index signature
}


function generateCustomTheme(themeData: any) {
  try {
    delete themeData["_rev"]
    delete themeData["_createdAt"]
    delete themeData["_id"]
    delete themeData["_type"]
    delete themeData["_updatedAt"]
    delete themeData["_id"]

    const oklch = converter('oklch')

    const theme: Theme = {}

    if (themeData) {
      // Set CSS variables based on custom theme colors
      Object.keys(themeData).forEach((colorKey) => {
        const colorValue = themeData[colorKey];
        const hexColor = parse(colorValue.hex)
        const oklchColor = oklch(hexColor)
        const colorCode = (oklchColor?.l ?? 0) + " " + (oklchColor?.c ?? 0) + " " + (oklchColor?.h ?? 0);
        theme["--" + colorKey] = colorCode;
      });
    }
    return theme;
  }
  catch (error) {
    console.error(error)
    return null
  }
}

export async function getBasePageProps(context: any) {
  const preview = context.draftMode || false;
  const previewToken = preview ? process.env.SANITY_READ_TOKEN : ``;
  const client = getClient(previewToken);

  const runQuery = makeSafeQueryRunner((query) => client.fetch(query));

  const headerData = await getHeaderData();
  const siteMetadata = await runQuery(siteMetadataQuery) as CustomSiteMetadata;

  try {
    const customDarkThemeVariables = siteMetadata.customThemes?.darkTheme && generateCustomTheme(siteMetadata.customThemes?.darkTheme)
    const customLightThemeVariables = siteMetadata.customThemes?.lightTheme && generateCustomTheme(siteMetadata.customThemes?.lightTheme)

    if (customDarkThemeVariables || customLightThemeVariables) {

      siteMetadata.customThemeVariables = {}
      siteMetadata.customThemeVariables.customDarkThemeVariables = customDarkThemeVariables;
      siteMetadata.customThemeVariables.customLightThemeVariables = customLightThemeVariables;
    }
  }
  catch (error) {
    console.error(error)
  }

  if (context.params) {
    context.params.locale = context?.locale;
  } else {
    context = { ...context, params: {} };
  }

  return {
    _nextI18Next: {
      ...(await serverSideTranslations(context.locale ?? "en", [
        'common',
        'footer',
      ]))
    }, ctx: context, preview, previewToken, siteMetadata, headerData
  };
}


