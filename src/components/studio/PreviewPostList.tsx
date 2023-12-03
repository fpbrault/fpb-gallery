// ./nextjs-pages/src/components/PreviewPost.tsx

import { useRouter } from "next/router";
import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import { postListQuery } from "@/pages/blog";
import PostList from "../PostList";

export default function PreviewPost({ posts }: { posts: SanityDocument }) {
  const params = useRouter().query;
  const [data] = useLiveQuery(null, postListQuery, params);
  if (data == null) {
    return null;
  }
  return <PostList posts={data} />;
} /*  */
