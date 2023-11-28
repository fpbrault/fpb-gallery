// ./nextjs-pages/src/components/PreviewPost.tsx

import { useRouter } from "next/router";
import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import { postQuery } from "@/pages/category/[categoryName]";
import AlbumGallery from "../AlbumGallery";

export default function PreviewAlbumGallery({ albums }: { albums: SanityDocument }) {
  const params = useRouter().query;
  const [data] = useLiveQuery(null, postQuery, params);
 if (data == null) {
  return null;
 }
  return <AlbumGallery albums={data} />;
}/*  */