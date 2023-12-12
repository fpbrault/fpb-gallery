import AlbumGallery from "@/components/Albums/AlbumGallery";
import { PreviewBar } from "@/components/studio/PreviewBar";
import { getCategories, getCustomPageContent, getLatestPost } from "@/sanity/lib/client";
import { GetStaticProps } from "next";
import { SanityDocument } from "next-sanity";
import dynamic from "next/dynamic";
import PreviewPage from "@/components/studio/PreviewPage";
import Page from "@/components/Page";
import HomePostMessage from "@/components/HomePostMessage";
import OpenGraphMetadata from "@/components/OpenGraphMetadata";
import { getBasePageProps } from '@/components/lib/pageHelpers';

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const customHomePageData = await getCustomPageContent('home', context.locale);
    const posts = await getLatestPost(context.locale ?? "en");
    const albumData = await getCategories();
    const dataWithPosts = { albumData, posts };


    return {
      props: {
        data: customHomePageData ? { ...customHomePageData, type: "customPage" } : dataWithPosts,
        ...await getBasePageProps(context)
      },
      revalidate: 3600
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      notFound: true
    };
  }
};

export default function IndexPage({
  data,
  preview,
  previewToken
}: {
  data: SanityDocument;
  preview: boolean;
  previewToken?: string;
}) {
  const post = data?.posts?.length > 0 ? data?.posts[0] ?? null : null;
  return (
    <>
      <OpenGraphMetadata title="Home"></OpenGraphMetadata>
      <div>
        {preview && previewToken ? (
          <PreviewProvider previewToken={previewToken}>
            {data.type == "customPage" ? (
              <PreviewPage page={data} />
            ) : (
              <div className="mb-4 font-sans text-sm text-center">
                {post && <HomePostMessage post={post} />}
                <AlbumGallery categories={true} albums={data.albumData} />
              </div>
            )}

            <PreviewBar />
          </PreviewProvider>
        ) : data && data.type == "customPage" ? (
          <Page page={data} />
        ) : (
          <div className="mb-4 font-sans text-sm text-center">
            {post && <HomePostMessage post={post} />}
            <AlbumGallery categories={true} albums={data.albumData} />
          </div>
        )}
      </div>
    </>
  );
}
