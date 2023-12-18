// pages/album/[albumId].tsx
import { useRouter } from "next/router";
import PhotoGallery from "@/components/Albums/PhotoGallery";
import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import { PortableText } from "@portabletext/react";
import dynamic from "next/dynamic";
import { GetStaticProps } from "next";

import { PreviewBar } from "@/components/studio/PreviewBar";
import PreviewPhotoGallery from "@/components/studio/PreviewPhotoGallery";
import { getBasePageProps, handlePageFetchError } from "@/components/lib/pageHelpers";
import { myPortableTextComponents } from "@/components/PortableText/myPortableTextComponents";
import OpenGraphMetadata from "@/components/OpenGraphMetadata";
import { getAllImages } from "@/sanity/lib/client";

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    if (context.params) {
      context.params.locale = context?.locale;
    }

    const data = await getAllImages();

    return {
      props: {
        data,
      ...await getBasePageProps(context)
      },
      revalidate: 3600
    };
  } catch (error) {
    return handlePageFetchError(error);
  }
};

export default function AlbumPage({
  data,
  preview,
  previewToken
}: {
  data: any;
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
      <OpenGraphMetadata title="All Images"></OpenGraphMetadata>
      <div>
        <Breadcrumbs items={[{ name: "everything" }]}></Breadcrumbs>
        <div className="max-w-xl pb-8 mx-auto prose text-center text-sans">
          <h2 className="text-5xl font-display">All Photos</h2>
          <PortableText value={data?.description} components={myPortableTextComponents as any} />
        </div>
        {preview && previewToken ? (
          <PreviewProvider previewToken={previewToken}>
            <PreviewPhotoGallery album={data} />
            <PreviewBar />
          </PreviewProvider>
        ) : (
          data && <PhotoGallery mode="masonry" columns={data?.columns} images={data} slug="all" />
        )}
      </div>
    </>
  );
}
