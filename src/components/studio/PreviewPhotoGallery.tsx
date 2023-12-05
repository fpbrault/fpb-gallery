// ./nextjs-pages/src/components/PreviewPost.tsx

import { useRouter } from "next/router";
import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import { albumQuery } from "@/pages/album/[slug]";
import PhotoGallery from "../PhotoGallery";
import { useContext } from "react";
import { PageContext } from "@/pages/_app";

export default function PreviewPhotoGallery({ album }: { album: SanityDocument }) {
  const context = useContext(PageContext);
  const params = context.params;
  const [data] = useLiveQuery(album, albumQuery, params) as any;
  if (data == null) {
    return null;
  }

  return (
    <PhotoGallery
      mode={data.display}
      columns={data.columns}
      images={data.images}
      albumId={data.albumId}
    />
  );
} /*  */
