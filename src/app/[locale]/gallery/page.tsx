import AlbumGallery from "@/components/Albums/AlbumGallery";
import HomePostMessage from "@/components/HomePostMessage";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/metadata";
import { getCategories, getLatestPost, getSiteShellData } from "@/sanity/data";

export async function generateMetadata({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { siteMetadata } = await getSiteShellData();
  return createPageMetadata({ locale, path: "/gallery", site: siteMetadata, title: "Gallery" });
}

export default async function GalleryPage({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const [categories, latestPost] = await Promise.all([getCategories(), getLatestPost(locale)]);

  return (
    <div className="my-4 font-sans text-sm text-center">
      {latestPost && <HomePostMessage post={latestPost} />}
      <AlbumGallery categories albums={categories} />
    </div>
  );
}
