// ./nextjs-pages/src/components/PreviewPost.tsx

import { useRouter } from "next/router";
import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import { pageQuery } from "@/pages/[...slug]";
import Page from "../Page";
import { useContext } from "react";
import { PageContext } from "@/pages/_app";

export default function PreviewPage({ page }: { page: SanityDocument }) {
  const context = useContext(PageContext);
  const params = context.params;
  const [data] = useLiveQuery(page, pageQuery, params);
  if (data == null) {
    return null;
  }
  return <Page page={data} />;
}
