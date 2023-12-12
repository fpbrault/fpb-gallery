// ./nextjs-pages/src/components/PreviewPost.tsx

import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import PhotoGallery from "../Albums/PhotoGallery";
import { usePageProps } from "../context/PagePropsContext";
import { albumQueryWithSlug } from "@/sanity/queries";

export default function PreviewPhotoGallery({ album }: { album: SanityDocument }) {
  const context = usePageProps();
  const params = context.params;
  const [data] = useLiveQuery(album, albumQueryWithSlug, params) as any;
  if (data == null) {
    return null;
  }

  return (
    <PhotoGallery
      mode={data.display}
      columns={data.columns}
      images={data.images}
      slug={data.albumId}
    />
  );
} /*  */
