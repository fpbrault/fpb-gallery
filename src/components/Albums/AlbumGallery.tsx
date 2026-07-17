"use client";

import * as React from "react";
import PhotoAlbum from "react-photo-album";
import { NextJsImageAlbum } from "../Albums/NextJsImage";
import { getResizedImage } from "@/sanity/lib/image";
import { localizePath } from "@/i18n/config";
import { useLocale } from "@/components/context/LocaleContext";
import type { AlbumSummary, CategorySummary } from "@/sanity/types";

// Define the AlbumGallery component
type AlbumGalleryProps = {
  albums: AlbumSummary[] | CategorySummary[];
  categories?: boolean;
};

const AlbumGallery: React.FC<AlbumGalleryProps> = ({ albums, categories }) => {
  const { locale } = useLocale();
  const photos = !categories
    ? (albums as AlbumSummary[])
        .filter((album) => album.images?.[0])
        .map((album) => {
          const cover = album.images[0]!;
          const { imageUrl, imageWidth, imageHeight } = getResizedImage(cover, 75, 600);
          return {
            href: localizePath("/album/" + album.slug.current, locale),
            src: imageUrl,
            width: imageWidth,
            height: imageHeight,
            blurDataURL: cover.placeholders?.metadata?.lqip,
            title: album.albumName,
            description: album.albumDescription
          };
        })
    : (albums as CategorySummary[])
        .filter((category) => category.albums?.[0])
        .map((category) => {
          const firstAlbum = category.albums[0]!;
          const cover = category.coverImage ?? firstAlbum.cover ?? firstAlbum.images[0];
          if (!cover) return null;
          const { imageUrl, imageWidth, imageHeight } = getResizedImage(cover, 75, 600);
          return {
            href: localizePath(
              category.albums.length > 1
                ? "/category/" + category.slug.current
                : "/album/" + firstAlbum.slug.current,
              locale
            ),
            src: imageUrl,
            width: imageWidth,
            height: imageHeight,
            title: category.categoryName,
            blurDataURL: cover.placeholders?.metadata?.lqip
          };
        })
        .filter((photo) => photo !== null);

  return (
    <div>
      <PhotoAlbum
        layout="rows"
        photos={photos}
        targetRowHeight={500}
        spacing={20}
        renderPhoto={(photo: any) =>
          NextJsImageAlbum({ limitHeight: photos.length < 2 ? true : false, ...photo })
        }
        sizes={{
          size: "calc(100vw - 240px)",
          sizes: [{ viewport: "(max-width: 960px)", size: "100vw" }]
        }}
        //onClick={handleImageClick}
      />
    </div>
  );
};

export default AlbumGallery;
