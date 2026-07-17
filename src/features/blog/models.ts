import type { ContentImage, PortableContent } from "@/features/content/models";
import type { Locale } from "@/i18n/config";

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
  localizedSlugs: Partial<Record<Locale, string>>;
};

export type PostPage = {
  current: Post;
  next: PostSummary | null;
  previous: PostSummary | null;
};
