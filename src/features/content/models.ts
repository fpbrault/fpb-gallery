import type { SanityImageAssetReference } from "@/sanity/sanity.types";
import type { SanityData } from "@/sanity/types";

type AlbumDescription = NonNullable<
  NonNullable<import("@/sanity/sanity.types").ALBUM_QUERY_RESULT>["description"]
>;

type AlbumImageDescription = NonNullable<
  NonNullable<
    NonNullable<import("@/sanity/sanity.types").ALBUM_QUERY_RESULT>["images"]
  >[number]["description"]
>;

export type PortableContent = SanityData<AlbumDescription>;
export type ImageDescription = SanityData<AlbumImageDescription>;

export type ContentImage = {
  _key: string;
  _type: "image";
  alt: string;
  asset: SanityImageAssetReference;
  decorative: boolean;
  description: ImageDescription;
  featured: boolean;
  placeholders: { metadata: { lqip?: string } };
  title: string;
};
