import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import Post from "../../components/Blog/Post";
import PreviewPost from "../../components/studio/PreviewPost";
import { SanityDocument } from "next-sanity";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next";
import { getPostBySlug, getPostPaths } from "@/sanity/lib/client";
import { PreviewBar } from "@/components/studio/PreviewBar";
import { useRouter } from "next/router";
import React from "react";
import { PostNavigation } from "../../components/Blog/PostNavigation";
import { handleLocaleRedirect, handlePageFetchError } from "@/components/lib/pageHelpers";
import OpenGraphMetadata from "@/components/OpenGraphMetadata";
import { getBasePageProps } from "@/components/lib/pageHelpers";
import { getSlugFromContext } from "@/components/lib/utils";

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));


export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const pathsForLocales = await getPostPaths(locales);
  
  return { paths: pathsForLocales, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const post = await getPostBySlug(getSlugFromContext(context), context?.locale ?? "en");

    /* const redirect = await handleLocaleRedirect(post, context, "blog/");
    if (redirect !== null) {
      return redirect;
    }
    if (!post) {
      throw new Error("Page not found");
    } */
    
    return { props: { 
      data: post ,
      ...(await getBasePageProps(context))
     }};
  } catch (error) {
    console.error(error)
    return handlePageFetchError(error, "/blog");
  }
};

export default function Page({
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
      <OpenGraphMetadata
        title={data?.current?.title}
        slug={data?.current?.slug?.current}
      ></OpenGraphMetadata>
      <div>
        <Breadcrumbs
          items={[{ name: "blog", url: "/blog" }, { name: data?.current?.title }]}
        ></Breadcrumbs>
        {preview && previewToken ? (
          <PreviewProvider previewToken={previewToken}>
            <PreviewPost post={data?.current} />
           {data && <PostNavigation data={data}></PostNavigation>}
            <PreviewBar />
          </PreviewProvider>
        ) : (
          data && (
            <>
              <Post post={data?.current} />
              <PostNavigation data={data}></PostNavigation>
            </>
          )
        )}
      </div>
    </>
  );
}
