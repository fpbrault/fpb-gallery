// ./nextjs-pages/src/components/PreviewPost.tsx
import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import Post from "../Post";
import { usePageProps } from "../lib/PagePropsContext";
import { postQuery } from "@/sanity/queries";

export default function PreviewPost({ post }: { post: SanityDocument }) {
  const context = usePageProps();
  const params = context.params;
  const [data] = useLiveQuery(post, postQuery, params);
  if (data == null) {
    return null;
  }
  return <Post post={data.current} />;
} 
