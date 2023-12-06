import { SanityDocument, groq } from "next-sanity";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import { PreviewBar } from "@/components/studio/PreviewBar";
import { useRouter } from "next/router";
import React from "react";
import PreviewPage from "@/components/studio/PreviewPage";
import Page from "@/components/Page";
import { getLocalizedPageProps, handlePageFetchError } from "@/components/lib/pageHelpers";
import Breadcrumbs from "@/components/BreadCrumbs";
import OpenGraphMetadata from "@/components/OpenGraphMetadata";

const queryLayoutPart = `_type == "layout-col-2"=>{...,rightCol[]{...,_type == "image" =>{asset, "blurDataURL": asset->.metadata.lqip},_type == "album" || _type == "albumCard" =>{...}->{...,images[0]{...,asset->}}}
,leftCol[]{...,_type == "image" =>{asset, "blurDataURL": asset->.metadata.lqip},_type == "album" || _type == "albumCard" =>{...}->{...,images[0]{...,asset->}}}}`;

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const pageQuery = groq`*[_type == "page" && slug.current == $slug && (language == $locale || language == "en" || language == "fr")] | score(language == $locale)
| order(_score desc)[0]{
  ...{"_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    slug,
    title,
    language
  }},title, content[]
  {...,
    ${queryLayoutPart},
    markDefs[]{
      ...,
      _type == "internalLink" => {"type": @.reference->_type,
        "slug": @.reference->slug
      }
    },
    _type == "image" =>{asset, "blurDataURL": asset->.metadata.lqip},
    _type == "album" || _type == "albumCard" =>{...}->{albumName,albumId,images[0]{...,asset->}}},
    "blurDataURL": coverImage.asset->.metadata.lqip
}`;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await client.fetch(
    groq`*[_type == "page" && defined(slug.current)][]{
      "params": {"slug": [slug.current], "locale": language, "name": "test" }, "locale": language,
    }`
  );

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    return getLocalizedPageProps(pageQuery, context, false);
  } catch (error) {
    return handlePageFetchError(error);
  }
};

export default function CustomPage({
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
    <><OpenGraphMetadata title={data?.title} ></OpenGraphMetadata>
    <div>
      <Breadcrumbs items={[{ name: data?.title }]}></Breadcrumbs>
      {preview && previewToken ? (
        <PreviewProvider previewToken={previewToken}>
          <PreviewPage page={data} />
          <PreviewBar />
        </PreviewProvider>
      ) : (
        data && (
          <>
            <Page page={data} />
          </>
        )
      )}
    </div></>
  );
}
