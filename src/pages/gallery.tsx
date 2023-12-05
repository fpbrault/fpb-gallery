import AlbumGallery from "@/components/AlbumGallery";
import { PreviewBar } from "@/components/studio/PreviewBar";
import { client } from "@/sanity/lib/client";
import { GetStaticProps } from "next";
import { SanityDocument, groq } from "next-sanity";
import dynamic from "next/dynamic";
import { getBasePageProps } from "../components/lib/getBasePageProps";
import PreviewPage from "@/components/studio/PreviewPage";
import Page from "@/components/Page";
import { pageQuery } from "./[...slug]";
import { getPageData } from "@/components/lib/getPageData";
import { getPageLocaleVersions, handleLocaleRedirect } from "@/components/lib/pageHelpers";
import { postListQuery } from "./blog";
import HomePostMessage from "@/components/HomePostMessage";

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const indexAlbumQuery = groq`*[_type == "category" && count(*[_type=="album" && references(^._id)]) > 0] {...,"albums": *[_type=="album" && references(^._id)]|
order(coalesce(publishDate, -1) desc){...,"cover": images[0]{asset, "placeholders" : asset->{metadata{lqip}}}}}`;

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    //Load custom Home Page data
    const customContext = { params: { slug: "home", locale: context.locale }, ...context };
    const customHomePageData = await client.fetch(pageQuery, customContext.params);

    const postListData = await client.fetch(postListQuery, context);

    const { _nextI18Next, ctx, preview, previewToken, siteMetadata, headerData } =
      await getBasePageProps(context);
    const { data } = await getPageData(indexAlbumQuery, ctx, previewToken);

    const { currentLocale, otherLocale } = getPageLocaleVersions(data, ctx);
    handleLocaleRedirect(currentLocale, ctx);
    ctx.otherLocale = otherLocale;
    const dataWithPosts = { albumData: data, posts: postListData };

    return {
      props: {
        ..._nextI18Next,
        data: customHomePageData ? { ...customHomePageData, type: "customPage" } : dataWithPosts,
        preview,
        previewToken,
        siteMetadata,
        context: ctx,
        headerData
      },
      revalidate: 30
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
  const post = data.posts[0] ?? null;
  return (
    <div>
      {preview && previewToken ? (
        <PreviewProvider previewToken={previewToken}>
          {data.type == "customPage" ? (
            <PreviewPage page={data} />
          ) : (
            <div className="my-4 font-sans text-sm text-center">
              <AlbumGallery categories={true} albums={data.albumData} />
            </div>
          )}

          <PreviewBar />
        </PreviewProvider>
      ) : data && data.type == "customPage" ? (
        <Page page={data} />
      ) : (
        <div className="my-4 font-sans text-sm text-center">
          {post && <HomePostMessage post={post} />}
          <AlbumGallery categories={true} albums={data.albumData} />
        </div>
      )}
    </div>
  );
}
