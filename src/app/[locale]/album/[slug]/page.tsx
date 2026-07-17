import { notFound } from "next/navigation";

import PhotoGallery from "@/components/Albums/PhotoGallery";
import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import { RichText } from "@/components/PortableText/RichText";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/metadata";
import { getAlbum, getAlbumSlugs, getSiteShellData } from "@/sanity/data";

export async function generateStaticParams() {
  const albums = await getAlbumSlugs();
  return albums.flatMap(({ slug }) => [
    { locale: "en", slug },
    { locale: "fr", slug }
  ]);
}

export async function generateMetadata({ params }: PageProps<"/[locale]/album/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const [album, { siteMetadata }] = await Promise.all([getAlbum(slug, locale), getSiteShellData()]);
  if (!album) return {};
  return createPageMetadata({
    locale,
    path: `/album/${slug}`,
    site: siteMetadata,
    title: album.albumName
  });
}

export default async function AlbumPage({ params }: PageProps<"/[locale]/album/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const album = await getAlbum(slug, locale);
  if (!album) notFound();

  return (
    <div>
      <Breadcrumbs
        items={[
          album.category
            ? { name: album.category.categoryName, url: `/category/${album.category.slug.current}` }
            : { name: "gallery", url: "/gallery" },
          { name: album.albumName }
        ]}
      />
      <div className="max-w-xl pb-8 mx-auto prose text-center text-sans">
        <h1 className="text-5xl font-display">{album.albumName}</h1>
        <RichText value={album.description} />
      </div>
      <PhotoGallery
        mode={album.display ?? "rows"}
        columns={album.columns}
        images={album.images ?? []}
      />
    </div>
  );
}
