// ./nextjs-pages/src/components/PreviewPost.tsx
import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import { postListQuery } from "@/pages/blog";
import PostList from "../PostList";
import { usePageProps } from "../lib/PagePropsContext";

export default function PreviewPost({ posts }: { posts: SanityDocument }) {
  const context = usePageProps();
  const params = context.params;
  const [data] = useLiveQuery(posts, postListQuery, params);
  if (data == null) {
    return null;
  }

  return <PostList posts={data?.posts ?? data} />;
} /*  */
