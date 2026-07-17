import type { AlbumSummary, CategorySummary } from "@/features/albums/models";
import type { ContentImage } from "@/features/content/models";
import type {
  AlbumCardPhoto,
  GalleryPresentation,
  GalleryThumbnail,
  LightboxSlideModel
} from "@/features/gallery/models";
import { localizePath, type Locale } from "@/i18n/config";
import { getResizedImage } from "@/sanity/lib/image";

export function mapGalleryImages(images: ContentImage[]): GalleryPresentation {
  const pairs = images.flatMap((image) => {
    try {
      const thumbnail = getResizedImage(image, 80, 1000);
      const lightbox = getResizedImage(image, 80, 2048);
      const lqip = image.placeholders.metadata.lqip;
      const thumbnailModel: GalleryThumbnail = {
        alt: image.alt,
        height: thumbnail.imageHeight,
        id: image._key,
        key: image._key,
        lqip,
        src: thumbnail.imageUrl,
        title: image.title,
        width: thumbnail.imageWidth
      };
      const slideModel: LightboxSlideModel = {
        alt: image.alt,
        description: image.description,
        height: lightbox.imageHeight,
        id: image._key,
        lqip,
        src: lightbox.imageUrl,
        title: image.title,
        width: lightbox.imageWidth
      };
      return [{ slide: slideModel, thumbnail: thumbnailModel }];
    } catch {
      return [];
    }
  });

  return {
    slides: pairs.map(({ slide }) => slide),
    thumbnails: pairs.map(({ thumbnail }) => thumbnail)
  };
}

export function mapAlbumCards(albums: AlbumSummary[], locale: Locale): AlbumCardPhoto[] {
  return albums.flatMap((album) => {
    const cover = album.images[0];
    if (!cover) return [];
    return mapAlbumCard(cover, album.id, album.name, `/album/${album.slug}`, locale);
  });
}

export function mapCategoryCards(categories: CategorySummary[], locale: Locale): AlbumCardPhoto[] {
  return categories.flatMap((category) => {
    const firstAlbum = category.albums[0];
    const cover = category.coverImage ?? firstAlbum?.images[0];
    if (!firstAlbum || !cover) return [];
    const path =
      category.albums.length > 1 ? `/category/${category.slug}` : `/album/${firstAlbum.slug}`;
    return mapAlbumCard(cover, category.id, category.name, path, locale);
  });
}

function mapAlbumCard(
  cover: ContentImage,
  id: string,
  title: string,
  path: string,
  locale: Locale
): AlbumCardPhoto[] {
  try {
    const { imageHeight, imageUrl, imageWidth } = getResizedImage(cover, 75, 600);
    return [
      {
        alt: cover.alt,
        blurDataURL: cover.placeholders.metadata.lqip,
        height: imageHeight,
        href: localizePath(path, locale),
        key: id,
        src: imageUrl,
        title,
        width: imageWidth
      }
    ];
  } catch {
    return [];
  }
}
