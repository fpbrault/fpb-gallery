import { mapContentImage } from "@/features/content/imageMapper";
import type { Post, PostPage, PostSummary } from "@/features/blog/models";
import type {
  LATEST_POST_QUERY_RESULT,
  POST_CURSOR_QUERY_RESULT,
  POST_LIST_QUERY_RESULT,
  POST_QUERY_RESULT
} from "@/sanity/sanity.types";

type PostSummaryInput = POST_CURSOR_QUERY_RESULT[number];

function mapPostSummary(input: PostSummaryInput | null): PostSummary | null {
  const slug = input?.slug?.current;
  if (!input || !slug) return null;

  return {
    id: input._id,
    blurDataURL: input.blurDataURL ?? undefined,
    coverImage: mapContentImage(input.coverImage, `${input._id}-cover`),
    excerpt: input.excerpt,
    publishDate: input.publishDate,
    slug,
    title: input.title ?? "Untitled post"
  };
}

export function mapPostList(input: POST_LIST_QUERY_RESULT) {
  return {
    posts: input.posts.map(mapPostSummary).filter((post) => post !== null),
    totalCount: input.totalCount
  };
}

export function mapPostSummaries(input: POST_CURSOR_QUERY_RESULT): PostSummary[] {
  return input.map(mapPostSummary).filter((post) => post !== null);
}

export function mapLatestPost(input: LATEST_POST_QUERY_RESULT): PostSummary | null {
  return mapPostSummary(input);
}

export function mapPostPage(input: POST_QUERY_RESULT): PostPage | null {
  const slug = input?.current.slug?.current;
  if (!input || !slug) return null;

  const current: Post = {
    id: input.current._id,
    coverImage: mapContentImage(input.current.coverImage, `${input.current._id}-cover`),
    content: input.current.content ?? [],
    excerpt: "",
    publishDate: input.current.publishDate,
    slug,
    title: input.current.title ?? "Untitled post"
  };

  return {
    current,
    next: mapPostSummary(input.next),
    previous: mapPostSummary(input.previous)
  };
}
