// Import necessary modules and components
import * as React from 'react';
import PhotoAlbum from 'react-photo-album';
import { NextJsImageAlbum } from './NextJsImage';
import { useRouter } from 'next/router';
import { getResizedImage } from '@/sanity/lib/client';

// Define the AlbumGallery component
type AlbumGalleryProps = {
  albums: any; // Assuming CustomAlbum is the type for your album data
  categories?: boolean;
};

const AlbumGallery: React.FC<AlbumGalleryProps> = ({ albums, categories }) => {

  const router = useRouter();

  const handleImageClick = ({ index: current }: {index: any}) => {
    let url = "/404"
    if (categories && albums[current].albums.length == 1) {
      url = `/album/${albums[current].albums[0].albumId}`
    } else {
      url = categories ? `/category/${albums[current].categoryName}` : `/album/${albums[current].albumId}`
    }

    router.push(url);
  };

  const photos = !categories ? albums.map((album: any) => {
    const { imageUrl, imageWidth, imageHeight,
    } = getResizedImage(album.images[0],75,800)
    return ({
    src: imageUrl,
    width: imageWidth,
    height: imageHeight,
    blurDataURL: album.images[0].placeholders.metadata.lqip,
    title: album.albumName,
    description: album.albumDescription,
  })}) : albums.map((category: { coverImage: any; coverImageWidth: any; coverImageHeight: any; categoryName: any; blurDataURL: any; }) => ({
    src: category.coverImage,
    width: category.coverImageWidth,
    height: category.coverImageHeight,
    title: category.categoryName,
    blurDataURL: category.blurDataURL
  }))


  return (
    <div>
      <PhotoAlbum
        layout="rows"
        photos={photos}
        targetRowHeight={500}
        spacing={20}
        renderPhoto={(photo) => NextJsImageAlbum({ limitHeight: photos.length < 3 ? true : false, ...photo })}
        sizes={{ size: "calc(100vw - 240px)", sizes: [{ viewport: "(max-width: 960px)", size: "100vw" }] }}
        onClick={handleImageClick}
      />

    </div>
  );
};

export default AlbumGallery;
