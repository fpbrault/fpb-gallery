import { notFound, permanentRedirect } from "next/navigation";

import Page from "@/components/Page";
import { LocaleProvider } from "@/components/context/LocaleContext";
import { getAlternateLocale, isLocale, localizePath } from "@/i18n/config";
import { createPageMetadata } from "@/lib/metadata";
import { getPage, getPageSlugs, getSiteShellData } from "@/sanity/data";

export async function generateStaticParams() {
  const pages = await getPageSlugs();
  return pages.map(({ language, slug }) => ({ locale: language, slug: slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[...slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const path = slug.join("/");
  const [page, { siteMetadata }] = await Promise.all([getPage(path, locale), getSiteShellData()]);
  if (!page) return {};
  return createPageMetadata({ locale, path: `/${path}`, site: siteMetadata, title: page.title });
}

export default async function CustomPage({ params }: PageProps<"/[locale]/[...slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const path = slug.join("/");
  const page = await getPage(path, locale);
  if (!page) notFound();

  if (page.slug.current !== path) permanentRedirect(localizePath(`/${page.slug.current}`, locale));

  const otherLocale = getAlternateLocale(locale);
  const translation = page._translations?.find((item) => item.language === otherLocale);
  const alternatePath = translation
    ? localizePath(`/${translation.slug.current}`, otherLocale)
    : localizePath(`/${path}`, otherLocale);

  return (
    <LocaleProvider locale={locale} alternatePath={alternatePath}>
      <Page page={page} />
    </LocaleProvider>
  );
}
