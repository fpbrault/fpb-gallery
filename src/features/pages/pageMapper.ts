import { isLocale } from "@/i18n/config";
import { stegaClean } from "next-sanity";
import type { CustomPage } from "@/features/pages/models";
import type { PAGE_QUERY_RESULT } from "@/sanity/sanity.types";

export function mapPage(input: PAGE_QUERY_RESULT): CustomPage | null {
  const slug = stegaClean(input?.slug?.current);
  const language = stegaClean(input?.language);
  if (!input || !slug || !language || !isLocale(language)) return null;

  return {
    id: input._id,
    content: input.content ?? [],
    locale: language,
    slug,
    title: input.title ?? "Untitled page",
    translations: input._translations.flatMap((translation) => {
      if (!translation) return [];
      const translatedSlug = stegaClean(translation?.slug?.current);
      const translatedLanguage = stegaClean(translation?.language);
      if (!translatedLanguage || !isLocale(translatedLanguage) || !translatedSlug) return [];
      return [
        {
          locale: translatedLanguage,
          slug: translatedSlug,
          title: translation.title ?? "Untitled page"
        }
      ];
    })
  };
}
