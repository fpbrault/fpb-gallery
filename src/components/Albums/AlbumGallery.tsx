"use client";

import PhotoAlbum from "react-photo-album";
import { AlbumCardImage } from "@/components/Albums/AlbumCardImage";
import { useLocale } from "@/components/context/LocaleContext";
import type { AlbumSummary, CategorySummary } from "@/features/albums/models";
import { mapAlbumCards, mapCategoryCards } from "@/features/gallery/galleryMapper";

// Define the AlbumGallery component
type AlbumGalleryProps = {
  albums: AlbumSummary[] | CategorySummary[];
  categories?: boolean;
};

const AlbumGallery = ({ albums, categories }: AlbumGalleryProps) => {
  const { locale } = useLocale();
  const photos = categories
    ? mapCategoryCards(albums as CategorySummary[], locale)
    : mapAlbumCards(albums as AlbumSummary[], locale);

  return (
    <div>
      <PhotoAlbum
        layout="rows"
        photos={photos}
        targetRowHeight={500}
        spacing={20}
        render={{
          photo: (renderProps, context) => (
            <AlbumCardImage
              context={context}
              key={context.photo.key ?? context.photo.src}
              limitHeight={photos.length < 2}
              renderProps={renderProps}
            />
          )
        }}
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
