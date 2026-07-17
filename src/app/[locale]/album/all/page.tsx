import PhotoGallery from "@/components/Albums/PhotoGallery";
import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/metadata";
import { getAllImages } from "@/sanity/repositories/albumRepository";
import { getSiteShellData } from "@/sanity/repositories/siteRepository";

export async function generateMetadata({ params }: PageProps<"/[locale]/album/all">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { siteMetadata } = await getSiteShellData(locale);
  return createPageMetadata({
    locale,
    path: "/album/all",
    site: siteMetadata,
    title: "All Images"
  });
}

export default async function AllImagesPage({ params }: PageProps<"/[locale]/album/all">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const images = await getAllImages();

  return (
    <div>
      <Breadcrumbs items={[{ name: "everything" }]} />
      <div className="max-w-xl pb-8 mx-auto prose text-center text-sans">
        <h1 className="text-5xl font-display">All Photos</h1>
      </div>
      <PhotoGallery mode="masonry" columns={3} images={images ?? []} />
    </div>
  );
}
