import type { ContentImage, PortableContent } from "@/features/content/models";

export type AlbumSummary = {
  id: string;
  name: string;
  slug: string;
  images: ContentImage[];
};

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  coverImage: ContentImage | null;
  albums: AlbumSummary[];
};

export type Album = AlbumSummary & {
  category: { name: string; slug: string } | null;
  columns: number;
  description: PortableContent;
  display: "rows" | "columns" | "masonry";
};
