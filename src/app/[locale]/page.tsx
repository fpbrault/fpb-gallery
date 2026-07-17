import AlbumGallery from "@/components/Albums/AlbumGallery";
import HomePostMessage from "@/components/HomePostMessage";
import Page from "@/components/Page";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/metadata";
import { getCategories, getLatestPost, getPage, getSiteShellData } from "@/sanity/data";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { siteMetadata } = await getSiteShellData();
  return createPageMetadata({ locale, path: "/", site: siteMetadata, title: "Home" });
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;

  const [customPage, categories, latestPost] = await Promise.all([
    getPage("home", locale),
    getCategories(),
    getLatestPost(locale)
  ]);

  if (customPage) return <Page page={customPage} />;

  return (
    <div className="mb-4 font-sans text-sm text-center">
      {latestPost && <HomePostMessage post={latestPost} />}
      <AlbumGallery categories albums={categories} />
    </div>
  );
}
