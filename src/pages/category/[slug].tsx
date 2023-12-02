// pages/album/[albumId].tsx
import { useRouter } from 'next/router';
import useSWR from 'swr';
import AlbumGallery from '@/components/AlbumGallery';
import Breadcrumbs from '@/components/BreadCrumbs';
import dynamic from 'next/dynamic';
import { SanityDocument, groq } from 'next-sanity';
import { GetStaticPaths, GetStaticProps } from 'next';
import { client, getClient } from '@/sanity/lib/client';
import PreviewAlbumGallery from '@/components/studio/PreviewAlbumGallery';
import { PreviewBar } from '@/components/studio/PreviewBar';
import { getBasePageProps } from '@/components/lib/getBasePageProps';


const fetcher = (url: RequestInfo | URL) => fetch(url).then(r => r.json())

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const categoryQuery = groq`*[_type == "album" && category->.slug.current == $slug]{...,"category": category->categoryName,images[]{...,"placeholders" : asset->{metadata{lqip}}}}|
order(coalesce(publishDate, -1) desc)`;


export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await client.fetch(
    groq`*[_type == "category" && defined(slug.current)][]{
      "params": { "slug": slug.current }
    }`
  );
  return { paths, fallback: true };
};


export const getStaticProps: GetStaticProps = async (context) => {

  
  try {
    const { data, preview, previewToken, siteMetadata, headerData } = await getBasePageProps(context, categoryQuery);
    // If the category data is not found, redirect to the home page
    if (!data || !data.length) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return { props: { data, preview, previewToken, siteMetadata, headerData, context },  revalidate: 10, };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};



export default function AlbumsPage({
  data,
  preview,
  previewToken,
}: {
  data: SanityDocument;
  preview: boolean;
  previewToken?: string;
}) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
    
  }

  return (
    <div>
     <Breadcrumbs items={[{ "name": data[0].category }]
      }></Breadcrumbs>
        {preview && previewToken ? (
            <PreviewProvider previewToken={previewToken}>
              <PreviewAlbumGallery albums={data} />
                <PreviewBar />
            </PreviewProvider>
        ) : (
            data && <AlbumGallery albums={data} />
        )}
    </div>
);
}

