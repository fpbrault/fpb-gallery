import PhotoGallery from "@/components/Albums/PhotoGallery";
import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/metadata";
import { getFeaturedImages } from "@/sanity/repositories/albumRepository";
import { getSiteShellData } from "@/sanity/repositories/siteRepository";

export async function generateMetadata({ params }: PageProps<"/[locale]/album/featured">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { siteMetadata } = await getSiteShellData(locale);
  return createPageMetadata({
    locale,
    path: "/album/featured",
    site: siteMetadata,
    title: "Featured Images"
  });
}

export default async function FeaturedImagesPage({
  params
}: PageProps<"/[locale]/album/featured">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const images = await getFeaturedImages();
  const title = locale === "fr" ? "Photo Préférées" : "Featured Photos";

  return (
    <div>
      <Breadcrumbs items={[{ name: "featured" }]} />
      <div className="max-w-xl pb-8 mx-auto prose text-center text-sans">
        <h1 className="text-5xl font-display">{title}</h1>
      </div>
      <PhotoGallery mode="masonry" columns={3} images={images ?? []} />
    </div>
  );
}
