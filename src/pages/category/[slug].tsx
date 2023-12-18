// pages/album/[albumId].tsx
import { useRouter } from "next/router";
import AlbumGallery from "@/components/Albums/AlbumGallery";
import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import dynamic from "next/dynamic";
import { SanityDocument } from "next-sanity";
import { GetStaticPaths, GetStaticProps } from "next";
import { getCategoryBySlug, getCategoryPaths } from "@/sanity/lib/client";
import PreviewAlbumGallery from "@/components/studio/PreviewAlbumGallery";
import { PreviewBar } from "@/components/studio/PreviewBar";
import { handlePageFetchError } from "@/components/lib/pageHelpers";
import OpenGraphMetadata from "@/components/OpenGraphMetadata";
import { getBasePageProps } from "@/components/lib/pageHelpers";
import { getSlugFromContext } from "@/components/lib/utils";

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getCategoryPaths();
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const category = await getCategoryBySlug(getSlugFromContext(context));
    return { props: { 
      data: category ,
      ...await getBasePageProps(context)
     }};
  } catch (error) {
    return handlePageFetchError(error);
  }
};

export default function AlbumsPage({
  data,
  preview,
  previewToken
}: {
  data: SanityDocument;
  preview: boolean;
  previewToken?: string;
}) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      {" "}
      <OpenGraphMetadata title={data[0]?.category}></OpenGraphMetadata>
      <div>
        <Breadcrumbs items={[{ name: data[0]?.category }]}></Breadcrumbs>
        {preview && previewToken ? (
          <PreviewProvider previewToken={previewToken}>
            <PreviewAlbumGallery albums={data} />
            <PreviewBar />
          </PreviewProvider>
        ) : (
          data && <AlbumGallery albums={data} />
        )}
      </div>
    </>
  );
}
