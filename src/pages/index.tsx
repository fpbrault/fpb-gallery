
import AlbumGallery from '@/components/AlbumGallery';
import { PreviewBar } from '@/components/studio/PreviewBar';
import { client } from '@/sanity/lib/client';
import { InferType, makeSafeQueryRunner } from 'groqd';
import { GetStaticProps } from 'next';
import { SanityDocument, groq } from 'next-sanity';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { getBasePageProps } from '../components/lib/getBasePageProps';


const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const indexQuery = groq`*[_type == "category" && count(*[_type=="album" && references(^._id)]) > 0] {...,"albums": *[_type=="album" && references(^._id)]|
order(coalesce(publishDate, -1) desc){...,"cover": images[0]{asset, "placeholders" : asset->{metadata{lqip}}}}}`;

export const runQuery = makeSafeQueryRunner((query) => client.fetch(query));



export const getStaticProps: GetStaticProps = async (context) => {
  const { data, preview, previewToken, siteMetadata, headerData } = await getBasePageProps(context, indexQuery);

  const otherLocale = data?._translations?.find((translation: { language: string; }) => translation.language != context.locale ) ?? null;

  const contextWithOtherLocale = {...context, otherLocale};

  
  return { props: { data, preview, previewToken, siteMetadata, context: contextWithOtherLocale, headerData }, revalidate: 10, };
};


export default function IndexPage({
  data,
  preview,
  previewToken,
}: {
  data: SanityDocument;
  preview: boolean;
  previewToken?: string;
}) {
  return (
    <div>
      {preview && previewToken ? (
        <PreviewProvider previewToken={previewToken}>
          <div className='my-4 font-sans text-sm text-center'>
            <AlbumGallery categories={true} albums={data} />
          </div>
          <PreviewBar />
        </PreviewProvider>
      ) : (
        data && <div className='my-4 font-sans text-sm text-center'>
          <AlbumGallery categories={true} albums={data} />
        </div>
      )}
    </div>
  );
}