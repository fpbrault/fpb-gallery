import { mapContentImage } from "@/features/content/imageMapper";
import type { Album, AlbumSummary, CategorySummary } from "@/features/albums/models";
import type {
  ALBUM_QUERY_RESULT,
  ALL_IMAGES_QUERY_RESULT,
  CATEGORY_INDEX_QUERY_RESULT,
  CATEGORY_QUERY_RESULT,
  FEATURED_IMAGES_QUERY_RESULT
} from "@/sanity/sanity.types";
import type { ContentImage } from "@/features/content/models";

type AlbumInput = CATEGORY_QUERY_RESULT[number];

function mapAlbumSummary(input: AlbumInput): AlbumSummary | null {
  const slug = input.slug?.current;
  if (!slug) return null;

  return {
    id: input._id,
    name: input.albumName ?? "Untitled album",
    slug,
    images: (input.images ?? [])
      .map((image, index) => mapContentImage(image, `${input._id}-${index}`))
      .filter((image) => image !== null)
  };
}

export function mapAlbums(input: CATEGORY_QUERY_RESULT): AlbumSummary[] {
  return input.map(mapAlbumSummary).filter((album) => album !== null);
}

export function mapCategories(input: CATEGORY_INDEX_QUERY_RESULT): CategorySummary[] {
  return input.flatMap((category) => {
    const slug = category.slug?.current;
    if (!slug) return [];

    const albums = category.albums.flatMap((album) => {
      const mapped = mapAlbumSummary(album);
      return mapped ? [mapped] : [];
    });
    if (!albums.length) return [];

    return [
      {
        id: category._id,
        name: category.categoryName ?? "Untitled category",
        slug,
        coverImage: mapContentImage(category.coverImage, `${category._id}-cover`),
        albums
      }
    ];
  });
}

export function mapAlbum(input: ALBUM_QUERY_RESULT): Album | null {
  if (!input?.slug?.current) return null;

  const summary = mapAlbumSummary(input);
  if (!summary) return null;

  return {
    ...summary,
    category: input.category?.slug?.current
      ? {
          name: input.category.categoryName ?? "Untitled category",
          slug: input.category.slug.current
        }
      : null,
    columns: input.columns ?? 3,
    description: input.description ?? [],
    display: input.display ?? "rows"
  };
}

export function mapImageCollection(
  input: ALL_IMAGES_QUERY_RESULT | FEATURED_IMAGES_QUERY_RESULT
): ContentImage[] {
  return input
    .map((image, index) => mapContentImage(image, `gallery-${index}`))
    .filter((image) => image !== null);
}
