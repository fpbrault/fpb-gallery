import { isLocale } from "@/i18n/config";
import type { CustomPage } from "@/features/pages/models";
import type { PAGE_QUERY_RESULT } from "@/sanity/sanity.types";

export function mapPage(input: PAGE_QUERY_RESULT): CustomPage | null {
  const slug = input?.slug?.current;
  if (!input || !slug || !input.language || !isLocale(input.language)) return null;

  return {
    id: input._id,
    content: input.content ?? [],
    locale: input.language,
    slug,
    title: input.title ?? "Untitled page",
    translations: input._translations.flatMap((translation) => {
      const translatedSlug = translation?.slug?.current;
      if (!translation?.language || !isLocale(translation.language) || !translatedSlug) return [];
      return [
        {
          locale: translation.language,
          slug: translatedSlug,
          title: translation.title ?? "Untitled page"
        }
      ];
    })
  };
}
