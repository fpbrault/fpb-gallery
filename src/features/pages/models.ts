import type { PortableContent } from "@/features/content/models";
import type { Locale } from "@/i18n/config";

export type PageTranslation = { locale: Locale; slug: string; title: string };

export type CustomPage = {
  id: string;
  content: PortableContent;
  locale: Locale;
  slug: string;
  title: string;
  translations: PageTranslation[];
};
