// ./nextjs-pages/src/components/PreviewPost.tsx

import { useRouter } from "next/router";
import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import { postQuery } from "@/pages/blog/[slug]";
import Post from "../Post";
import { useContext } from "react";
import { PageContext } from "@/pages/_app";

export default function PreviewPost({ post }: { post: SanityDocument }) {
  const context = useContext(PageContext);
  const params = context.params;
  const [data] = useLiveQuery(post, postQuery, params);
  if (data == null) {
    return null;
  }
  return <Post post={data.current} />;
} /*  */
