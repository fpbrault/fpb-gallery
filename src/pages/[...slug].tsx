import { SanityDocument, groq } from "next-sanity";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next";
import { client, getCustomPageContent } from "@/sanity/lib/client";
import { PreviewBar } from "@/components/studio/PreviewBar";
import { useRouter } from "next/router";
import React from "react";
import PreviewPage from "@/components/studio/PreviewPage";
import Page from "@/components/Page";
import { handleLocaleRedirect, handlePageFetchError } from "@/components/lib/pageHelpers";
import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import OpenGraphMetadata from "@/components/OpenGraphMetadata";
import { getBasePageProps } from "@/components/lib/pageHelpers";
import { getSlugFromContext } from "@/components/lib/utils";

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
    
    const pageContent = await getCustomPageContent(getSlugFromContext(context), context.locale);

    const redirect = await handleLocaleRedirect(pageContent, context, "");
    if (redirect !== null) {
      return redirect;
    }
    if (!pageContent) {
      throw new Error("Page not found");
    }

    return { props: { 
       data: {...pageContent },
       ...(await getBasePageProps(context))
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
