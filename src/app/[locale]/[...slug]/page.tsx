import { notFound, permanentRedirect } from "next/navigation";

import Page from "@/components/Page";
import { LocaleProvider } from "@/components/context/LocaleContext";
import { getAlternateLocale, isLocale, localizePath } from "@/i18n/config";
import { createPageMetadata } from "@/lib/metadata";
import { getPage, getPageSlugs } from "@/sanity/repositories/pageRepository";
import { getSiteShellData } from "@/sanity/repositories/siteRepository";

export async function generateStaticParams() {
  const pages = await getPageSlugs();
  return pages.map(({ language, slug }) => ({ locale: language, slug: slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[...slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const path = slug.join("/");
  const [page, { siteMetadata }] = await Promise.all([
    getPage(path, locale),
    getSiteShellData(locale)
  ]);
  if (!page) return {};
  const localizedPaths = Object.fromEntries([
    [page.locale, `/${page.slug}`],
    ...page.translations.map((translation) => [translation.locale, `/${translation.slug}`])
  ]);
  return createPageMetadata({
    locale,
    path: `/${path}`,
    site: siteMetadata,
    title: page.title,
    localizedPaths
  });
}

export default async function CustomPage({ params }: PageProps<"/[locale]/[...slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const path = slug.join("/");
  const page = await getPage(path, locale);
  if (!page) notFound();

  if (page.slug !== path) permanentRedirect(localizePath(`/${page.slug}`, locale));

  const otherLocale = getAlternateLocale(locale);
  const translation = page.translations.find((item) => item.locale === otherLocale);
  const alternatePath = translation
    ? localizePath(`/${translation.slug}`, otherLocale)
    : localizePath(`/${path}`, otherLocale);

  return (
    <LocaleProvider locale={locale} alternatePath={alternatePath}>
      <Page page={page} />
    </LocaleProvider>
  );
}
