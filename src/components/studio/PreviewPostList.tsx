// ./nextjs-pages/src/components/PreviewPost.tsx
import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import { postListQuery } from "@/pages/blog";
import PostList from "../PostList";
import { useContext } from "react";
import { PageContext } from "@/pages/_app";

export default function PreviewPost({ posts }: { posts: SanityDocument }) {
  const context = useContext(PageContext);
  const params = context.params;
  const [data] = useLiveQuery(null, postListQuery, params);
  if (data == null) {
    return null;
  }
  
  return <PostList posts={data} />;
} /*  */
