// ./nextjs-pages/src/components/PreviewPost.tsx

import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import { pageQuery } from "@/pages/[...slug]";
import Page from "../Page";
import { usePageProps } from "../lib/PagePropsContext";

export default function PreviewPage({ page }: { page: SanityDocument }) {
  const context = usePageProps();
  const params = context.params;
  const [data] = useLiveQuery(page, pageQuery, params);
  if (data == null) {
    return null;
  }
  return <Page page={data} />;
}
