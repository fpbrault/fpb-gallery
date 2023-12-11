// ./nextjs-pages/src/components/PreviewPost.tsx

import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import Page from "../Page";
import { usePageProps } from "../lib/PagePropsContext";
import { pageQuery } from "@/sanity/queries";

export default function PreviewPage({ page }: { page: SanityDocument }) {
  const context = usePageProps();
  const [data] = useLiveQuery(page, pageQuery, context.params);
  if (data == null) {
    return null;
  }
  return <Page page={data} />;
}
