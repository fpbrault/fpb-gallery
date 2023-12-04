// Import necessary modules and components
import * as React from "react";
import PhotoAlbum from "react-photo-album";
import { NextJsImageAlbum } from "./NextJsImage";
import { useRouter } from "next/router";
import { getResizedImage } from "@/sanity/lib/client";

// Define the AlbumGallery component
type AlbumGalleryProps = {
  albums: any; // Assuming CustomAlbum is the type for your album data
  categories?: boolean;
};

const AlbumGallery: React.FC<AlbumGalleryProps> = ({ albums, categories }) => {

  const photos = !categories
    ? albums.map((album: any) => {
        const { imageUrl, imageWidth, imageHeight } = getResizedImage(album.images[0], 75, 600);
        return {
          href: "/album/" + album.slug.current,
          src: imageUrl,
          width: imageWidth,
          height: imageHeight,
          blurDataURL: album.images[0].placeholders.metadata.lqip,
          title: album.albumName,
          description: album.albumDescription
        };
      })
    : albums.map((category: any) => {
        const { imageUrl, imageWidth, imageHeight } = getResizedImage(
          category.albums[0].cover,
          75,
          800
        );

        return {
          href:
            category.albums.length > 1
              ? "/category/" + category.slug.current
              : "/album/" + category.albums[0].slug.current,
          src: imageUrl,
          width: imageWidth,
          height: imageHeight,
          title: category.categoryName,
          blurDataURL: category.albums[0].cover.placeholders.metadata.lqip
        };
      });

  return (
    <div>
      <PhotoAlbum
        layout="rows"
        photos={photos}
        targetRowHeight={500}
        spacing={20}
        renderPhoto={(photo) =>
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
