// pages/album/[albumId].tsx
import { useRouter } from "next/router";
import PhotoGallery from "@/components/PhotoGallery";
import Breadcrumbs from "@/components/BreadCrumbs";
import { PortableText } from "@portabletext/react";
import dynamic from "next/dynamic";
import { SanityDocument, groq } from "next-sanity";
import { GetStaticPaths, GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import { PreviewBar } from "@/components/studio/PreviewBar";
import PreviewPhotoGallery from "@/components/studio/PreviewPhotoGallery";
import { getLocalizedPageProps, handlePageFetchError } from "@/components/lib/pageHelpers";
import { myPortableTextComponents } from "@/components/PortableText/myPortableTextComponents";
import OpenGraphMetadata from "@/components/OpenGraphMetadata";
import { albumQueryWithSlug } from "@/sanity/queries";

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));


export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await client.fetch(
    groq`*[_type == "album" && defined(slug.current)][]{
      "params": { "slug": slug.current }
    }`
  );
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    return getLocalizedPageProps(albumQueryWithSlug, context, false);
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
          <h2>{data?.albumName}</h2>
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
              images={data?.images}
              slug={data?.slug?.current}
            />
          )
        )}
      </div>
    </>
  );
}
