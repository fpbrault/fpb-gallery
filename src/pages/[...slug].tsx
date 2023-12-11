import { SanityDocument, groq } from "next-sanity";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next";
import { client, getCustomPageContent } from "@/sanity/lib/client";
import { PreviewBar } from "@/components/studio/PreviewBar";
import { useRouter } from "next/router";
import React from "react";
import PreviewPage from "@/components/studio/PreviewPage";
import Page from "@/components/Page";
import {  handlePageFetchError } from "@/components/lib/pageHelpers";
import Breadcrumbs from "@/components/BreadCrumbs";
import OpenGraphMetadata from "@/components/OpenGraphMetadata";
import { getBasePageProps } from "@/components/lib/getBasePageProps";
import { getTranslations } from '../components/lib/newHelpers';

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));

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
    const { ctx, preview, previewToken, siteMetadata, headerData } =
    await getBasePageProps(context);
    
    const pageContent = await getCustomPageContent(ctx.params?.slug, ctx.locale);

    if (!pageContent) {
      throw new Error("Page not found");
    }

    return { props: { 
      ...getTranslations(ctx),
       data: {...pageContent },
       preview,
       previewToken,
       siteMetadata,
       headerData,
       context: ctx
      }};
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
    <>
      <OpenGraphMetadata title={data?.title}></OpenGraphMetadata>
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
      </div>
    </>
  );
}
