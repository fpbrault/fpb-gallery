// pages/album/[albumId].tsx
import { useRouter } from "next/router";
import PhotoGallery from "@/components/PhotoGallery";
import Breadcrumbs from "@/components/BreadCrumbs";
import { PortableText } from "@portabletext/react";
import dynamic from "next/dynamic";
import { groq } from "next-sanity";
import { GetStaticProps } from "next";
import { PreviewBar } from "@/components/studio/PreviewBar";
import PreviewPhotoGallery from "@/components/studio/PreviewPhotoGallery";
import { getBasePageProps } from "@/components/lib/getBasePageProps";
import { getPageData } from "@/components/lib/getPageData";
import { handlePageFetchError } from "@/components/lib/pageHelpers";
import { myPortableTextComponents } from "@/components/PortableText/myPortableTextComponents";
import { useTranslation } from "next-i18next";

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const albumQuery = groq`*[_type == "album"]{...,category->,images[featured == true]
  {...,"placeholders" : asset->{metadata{lqip}}}}.images[]`;

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    if (context.params) {
      context.params.locale = context?.locale;
    }
    const { _nextI18Next, ctx, preview, previewToken, siteMetadata, headerData } =
      await getBasePageProps(context);

    const { data } = await getPageData(albumQuery, ctx, previewToken);

    function shuffleArray(array: any) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    const newData = shuffleArray(data);

    return {
      props: {
        ..._nextI18Next,
        data: newData,
        preview,
        previewToken,
        siteMetadata,
        headerData,
        context: ctx
      },
      revalidate: 30
    };
  } catch (error) {
    return handlePageFetchError(error);
  }
};

export default function AlbumPage({
  data,
  preview,
  previewToken
}: {
  data: any;
  preview: boolean;
  previewToken?: string;
}) {
  const { t } = useTranslation("common");
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
      <Breadcrumbs items={[{ name: "featured" }]}></Breadcrumbs>
      <div className="max-w-xl pb-8 mx-auto prose text-center text-sans">
        <h2>{t("featuredHeader")}</h2>
        <PortableText value={data.description} components={myPortableTextComponents as any} />
      </div>
      {preview && previewToken ? (
        <PreviewProvider previewToken={previewToken}>
          <PreviewPhotoGallery album={data} />
          <PreviewBar />
        </PreviewProvider>
      ) : (
        data && (
          <PhotoGallery mode="masonry" columns={data.columns} images={data} albumId="featured" />
        )
      )}
    </div>
  );
}
