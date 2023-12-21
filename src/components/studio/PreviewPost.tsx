// ./nextjs-pages/src/components/PreviewPost.tsx
import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import Post from "../Blog/Post";
import { usePageProps } from "../context/PagePropsContext";
import { postQuery } from "@/sanity/queries";

export default function PreviewPost({ post }: { post: SanityDocument }) {
  const context = usePageProps();
  const params = context.params;
  const [data] = useLiveQuery(post ?? null, postQuery, params);
  if (data == null) {
    return null;
  }
  return <Post post={data?.current} />;
} 
