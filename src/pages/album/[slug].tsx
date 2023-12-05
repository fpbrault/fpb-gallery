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

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const albumQuery = groq`*[_type == "album" && slug.current == $slug][0]{...,
  "description": albumContent[_key == $locale][0]{value[]
    {...,
      _type == "Post"=>{...}->{coverImage{...,asset->}, title[_key == $locale]},
      _type == "album" || _type == "albumCard" =>{...}->{albumName,albumId,images[0]{...,asset->}}}}.value

,
  category->,images[]{...,"placeholders" : asset->{metadata{lqip}}}}`;

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
    return getLocalizedPageProps(albumQuery, context,false)
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
    <div>
      <Breadcrumbs
        items={[
          { name: data.category.categoryName, url: "/category/" + data.category.categoryName },
          { name: data.albumName }
        ]}
      ></Breadcrumbs>
      <div className="max-w-xl pb-8 mx-auto prose text-center text-sans">
        <h2>{data.albumName}</h2>
        <PortableText value={data.description} components={myPortableTextComponents as any} />
      </div>
      {preview && previewToken ? (
        <PreviewProvider previewToken={previewToken}>
          <PreviewPhotoGallery album={data} />
          <PreviewBar />
        </PreviewProvider>
      ) : (
        data && (
          <PhotoGallery
            mode={data.display}
            columns={data.columns}
            images={data.images}
            albumId={data.slug.current}
          />
        )
      )}
    </div>
  );
}
