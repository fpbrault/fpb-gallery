import { notFound } from "next/navigation";

import AlbumGallery from "@/components/Albums/AlbumGallery";
import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/metadata";
import { getCategory, getCategorySlugs, getSiteShellData } from "@/sanity/data";

export async function generateStaticParams() {
  const categories = await getCategorySlugs();
  return categories.flatMap(({ slug }) => [
    { locale: "en", slug },
    { locale: "fr", slug }
  ]);
}

export async function generateMetadata({ params }: PageProps<"/[locale]/category/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const { siteMetadata } = await getSiteShellData();
  return createPageMetadata({ locale, path: `/category/${slug}`, site: siteMetadata, title: slug });
}

export default async function CategoryPage({ params }: PageProps<"/[locale]/category/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const albums = await getCategory(slug);
  if (!albums?.length) notFound();

  return (
    <div>
      <Breadcrumbs items={[{ name: slug }]} />
      <AlbumGallery albums={albums} />
    </div>
  );
}
