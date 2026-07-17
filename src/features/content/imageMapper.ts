import type { ContentImage, ImageDescription } from "@/features/content/models";
import type { SanityImageAssetReference } from "@/sanity/sanity.types";

type ImageInput = {
  _key?: string | null;
  _type: "image";
  alt?: string | null;
  asset?: SanityImageAssetReference | null;
  decorative?: boolean | null;
  description?: ImageDescription | null;
  featured?: boolean | null;
  placeholders?: { metadata?: { lqip?: string | null } | null } | null;
  title?: string | null;
};

export function mapContentImage(
  input: ImageInput | null,
  fallbackKey: string
): ContentImage | null {
  if (!input?.asset?._ref) return null;

  return {
    _key: input._key ?? fallbackKey,
    _type: "image",
    alt: input.decorative ? "" : (input.alt ?? ""),
    asset: input.asset,
    decorative: input.decorative ?? false,
    description: input.description ?? [],
    featured: input.featured ?? false,
    placeholders: { metadata: { lqip: input.placeholders?.metadata?.lqip ?? undefined } },
    title: input.title ?? ""
  };
}
