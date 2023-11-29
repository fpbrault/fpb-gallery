
import AlbumGallery from '@/components/AlbumGallery';
import { PreviewBar } from '@/components/studio/PreviewBar';
import { getClient } from '@/sanity/lib/client';
import { GetStaticProps } from 'next';
import { SanityDocument, groq } from 'next-sanity';
import dynamic from 'next/dynamic';
import useSWR from 'swr';


const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const indexQuery = groq`*[_type == "category" && count(*[_type=="album" && references(^._id)]) > 0] {...,"albums": *[_type=="album" && references(^._id)]{...,"cover": images[0]{asset, "placeholders" : asset->{metadata{lqip}}}}}`;




export const getStaticProps: GetStaticProps = async (context) => {
  const preview = context.draftMode || false;
  const previewToken = preview ? process.env.SANITY_READ_TOKEN : ``;
  const client = getClient(previewToken);

  const data = await client.fetch(indexQuery, context.params);
  return { props: { data, preview, previewToken } };
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