import type { LightboxSlideModel } from "@/features/gallery/models";
import { getResizedImage } from "@/sanity/lib/image";
import { stegaClean } from "next-sanity";

export type PortableImageValue = {
  _key?: string;
  _type: "image";
  alt?: string;
  asset?: { _ref: string; _type?: "reference" };
  blurDataURL?: string;
  decorative?: boolean;
  placeholders?: { metadata?: { lqip?: string } };
};

export type PortableImageRegistryEntry = {
  id: string;
  slide: LightboxSlideModel;
  thumbnail: { height: number; src: string; width: number };
};

export function collectPortableImages(value?: unknown[]): PortableImageRegistryEntry[] {
  if (!value?.length) return [];
  return value.flatMap((item) => collectPortableImage(item));
}

export function getPortableImageId(value: PortableImageValue): string | null {
  return stegaClean(value._key ?? value.asset?._ref) ?? null;
}

function collectPortableImage(value: unknown): PortableImageRegistryEntry[] {
  if (!isRecord(value)) return [];

  if (value._type === "image") {
    const image = value as PortableImageValue;
    const id = getPortableImageId(image);
    if (!id || !image.asset?._ref) return [];

    try {
      const imageSource = {
        ...image,
        asset: { ...image.asset, _ref: stegaClean(image.asset._ref) }
      };
      const thumbnail = getResizedImage(imageSource, 75, 1000);
      const lightbox = getResizedImage(imageSource, 80, 2048);
      const lqip = stegaClean(image.blurDataURL ?? image.placeholders?.metadata?.lqip);
      return [
        {
          id,
          slide: {
            alt: image.decorative ? "" : (image.alt ?? ""),
            height: lightbox.imageHeight,
            id,
            lqip,
            src: lightbox.imageUrl,
            width: lightbox.imageWidth
          },
          thumbnail: {
            height: thumbnail.imageHeight,
            src: thumbnail.imageUrl,
            width: thumbnail.imageWidth
          }
        }
      ];
    } catch {
      return [];
    }
  }

  if (value._type === "layout-col-2") {
    return [value.leftCol, value.rightCol].flatMap((column) =>
      Array.isArray(column) ? collectPortableImages(column) : []
    );
  }

  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
