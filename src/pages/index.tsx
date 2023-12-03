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

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const indexAlbumQuery = groq`*[_type == "category" && count(*[_type=="album" && references(^._id)]) > 0] {...,"albums": *[_type=="album" && references(^._id)]|
order(coalesce(publishDate, -1) desc){...,"cover": images[0]{asset, "placeholders" : asset->{metadata{lqip}}}}}`;

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    //Load custom Home Page data
    const customContext = { params: { slug: "home", locale: context.locale }, ...context };
    const customHomePageData = await client.fetch(pageQuery, customContext.params);

    const { ctx, preview, previewToken, siteMetadata, headerData } = await getBasePageProps(context);
    const { data } = await getPageData(indexAlbumQuery, ctx, previewToken);


    const { currentLocale, otherLocale } = getPageLocaleVersions(data, ctx);
    handleLocaleRedirect(currentLocale, ctx);
    ctx.otherLocale = otherLocale;

    return {
      props: {
        data: customHomePageData ? { ...customHomePageData, type: "customPage" } : data,
        preview,
        previewToken,
        siteMetadata,
        context: ctx,
        headerData
      },
      revalidate: 10
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
  return (
    <div>
      {preview && previewToken ? (
        <PreviewProvider previewToken={previewToken}>
          {data.type == "customPage" ? (
            <PreviewPage page={data} />
          ) : (
            <div className="my-4 font-sans text-sm text-center">
              <AlbumGallery categories={true} albums={data} />
            </div>
          )}

          <PreviewBar />
        </PreviewProvider>
      ) : data && data.type == "customPage" ? (
        <Page page={data} />
      ) : (
        <div className="my-4 font-sans text-sm text-center">
          <AlbumGallery categories={true} albums={data} />
        </div>
      )}
    </div>
  );
}
