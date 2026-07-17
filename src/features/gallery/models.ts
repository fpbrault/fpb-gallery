import type { Photo } from "react-photo-album";

import type { ImageDescription } from "@/features/content/models";

export type AlbumCardPhoto = Photo & {
  blurDataURL?: string;
  href: string;
  key: string;
  title: string;
};

export type GalleryThumbnail = Photo & {
  alt: string;
  id: string;
  key: string;
  lqip?: string;
};

export type LightboxSlideModel = {
  alt: string;
  description?: ImageDescription;
  height: number;
  id: string;
  lqip?: string;
  src: string;
  title?: string;
  width: number;
};

export type GalleryPresentation = {
  slides: LightboxSlideModel[];
  thumbnails: GalleryThumbnail[];
};
