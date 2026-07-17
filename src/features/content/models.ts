import type { SanityImageAssetReference } from "@/sanity/sanity.types";

export type PortableContent = NonNullable<
  NonNullable<import("@/sanity/sanity.types").ALBUM_QUERY_RESULT>["description"]
>;

export type ImageDescription = NonNullable<
  NonNullable<
    NonNullable<import("@/sanity/sanity.types").ALBUM_QUERY_RESULT>["images"]
  >[number]["description"]
>;

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
