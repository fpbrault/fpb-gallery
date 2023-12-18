// pages/album/[albumId].tsx
import { useRouter } from "next/router";
import PhotoGallery from "@/components/Albums/PhotoGallery";
import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import { PortableText } from "@portabletext/react";
import dynamic from "next/dynamic";
import { SanityDocument } from "next-sanity";
import { GetStaticPaths, GetStaticProps } from "next";
import {  getAlbumBySlug, getAlbumPaths } from "@/sanity/lib/client";
import { PreviewBar } from "@/components/studio/PreviewBar";
import PreviewPhotoGallery from "@/components/studio/PreviewPhotoGallery";
import { handleLocaleRedirect, handlePageFetchError } from "@/components/lib/pageHelpers";
import { myPortableTextComponents } from "@/components/PortableText/myPortableTextComponents";
import OpenGraphMetadata from "@/components/OpenGraphMetadata";
import { getSlugFromContext } from "@/components/lib/utils";
import { getBasePageProps } from "@/components/lib/pageHelpers";

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));


export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAlbumPaths();
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const album = await getAlbumBySlug(getSlugFromContext(context), context.locale);
    const redirect = await handleLocaleRedirect(album, context, "");
    if (redirect !== null) {
      return redirect;
    }
    if (!album) {
      throw new Error("Page not found");
    }
    
    return { props: { 
      data: album,
      ...await getBasePageProps(context)
     }};
  } catch (error) {
    return handlePageFetchError(error);
  }
};

export default function AlbumPage({
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
      <OpenGraphMetadata title={data?.albumName}></OpenGraphMetadata>
      <div>
        <Breadcrumbs
          items={[
            { name: data?.category?.categoryName, url: "/category/" + data?.category?.slug.current },
            { name: data?.albumName }
          ]}
        ></Breadcrumbs>
        <div className="max-w-xl pb-8 mx-auto prose text-center text-sans">
          <h2 className="text-5xl font-display">{data?.albumName}</h2>
          <PortableText value={data?.description} components={myPortableTextComponents as any} />
        </div>
        {preview && previewToken ? (
          <PreviewProvider previewToken={previewToken}>
            <PreviewPhotoGallery album={data} />
            <PreviewBar />
          </PreviewProvider>
        ) : (
          data && (
            <PhotoGallery
              mode={data?.display}
              columns={data?.columns}
              images={data.images}
              slug={data?.slug?.current}
            />
          )
        )}
      </div>
    </>
  );
}