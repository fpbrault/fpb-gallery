// pages/album/[albumId].tsx
import { useRouter } from 'next/router';
import PhotoGallery from '@/components/PhotoGallery';
import useSWR from 'swr';
import AlbumGallery from '@/components/AlbumGallery';
import Breadcrumbs from '@/components/BreadCrumbs';
import dynamic from 'next/dynamic';
import { SanityDocument, groq } from 'next-sanity';
import { GetStaticPaths, GetStaticProps } from 'next';
import { client, getClient } from '@/sanity/lib/client';
import PreviewAlbumGallery from '@/components/studio/PreviewAlbumGallery';
import { PreviewBar } from '../../components/studio/PreviewBar';


const fetcher = (url: RequestInfo | URL) => fetch(url).then(r => r.json())

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const postQuery = groq`*[_type == "album" && lower(category->categoryName) == lower($categoryName)]{...,"category": category->categoryName,images[]{...,"placeholders" : asset->{metadata{lqip}}}}`;


export const getStaticPaths: GetStaticPaths = async () => {
  const categoryName = "portrait"
  const paths = await client.fetch(
    groq`*[_type == "category"]{
      "params": { "categoryName": categoryName }
    }`
  );
  console.log(paths)
  return { paths, fallback: false };
};


export const getStaticProps: GetStaticProps = async (context) => {
  const preview = context.draftMode || false;
  const previewToken = preview ? process.env.SANITY_READ_TOKEN : ``;
  const client = getClient(previewToken);
  const data = await client.fetch(postQuery, context.params);
  /* 
    const width = 1000;
    const height = 750
    const imageUrl = await getResizedImage(data.coverImage, 80, height)
  
  
    const dataWithImage = {
      ...data,
      imageUrl: imageUrl,
      imageWidth: width,
      imageHeight: height,
      blurDataUrl: data.blurDataURL
    }; */
  return { props: { data, preview, previewToken } };
};



export default function Page({
  data,
  preview,
  previewToken,
}: {
  data: SanityDocument;
  preview: boolean;
  previewToken?: string;
}) {
  if (preview && previewToken) {
    return (
      <PreviewProvider previewToken={previewToken}>
        <Breadcrumbs items={[{ "name": data[0].category }]
      }></Breadcrumbs>
        <PreviewAlbumGallery albums={data} />
        <PreviewBar></PreviewBar>
      </PreviewProvider>
    );


  }
  if (data) {
    return <AlbumGallery albums={data} />;
  }
  return null;
}

const AlbumPage = () => {
  const router = useRouter();
  const { categoryName } = router.query;
  const shouldFetch = categoryName ?? false

  const { data, error } = useSWR(shouldFetch ? ('/api/categories/' + categoryName) : null, fetcher)
  if (!data) {
    return null
  }

  // Fetch data for the specific album using albumId

  return (

    <div>
      <Breadcrumbs items={[{ "name": categoryName }]
      }></Breadcrumbs>
      <div className='max-w-xl mx-auto text-base prose text-center text-sans'>
        <h2>{data.categoryName}</h2>
      </div>
      <AlbumGallery albums={data} />
    </div>
  );
};

