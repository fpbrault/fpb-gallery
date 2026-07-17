import type { ContentImage, PortableContent } from "@/features/content/models";

export type PostSummary = {
  id: string;
  blurDataURL?: string;
  coverImage: ContentImage | null;
  excerpt: string;
  publishDate: string | null;
  slug: string;
  title: string;
};

export type Post = PostSummary & {
  content: PortableContent;
};

export type PostPage = {
  current: Post;
  next: PostSummary | null;
  previous: PostSummary | null;
};
