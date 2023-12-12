import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import AlbumGallery from "../Albums/AlbumGallery";
import { usePageProps } from "../context/PagePropsContext";
import { categoryQuery } from "@/sanity/queries";

export default function PreviewAlbumGallery({ albums }: { albums: SanityDocument }) {
  const context = usePageProps();
  const params = context.params;
  const [data] = useLiveQuery(albums, categoryQuery, params);
  if (data == null) {
    return null;
  }
  return <AlbumGallery albums={data} />;
} /*  */
