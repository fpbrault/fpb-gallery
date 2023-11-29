// pages/album/[albumId].tsx
import { useRouter } from 'next/router';
import PhotoGallery from '@/components/PhotoGallery';
import useSWR from 'swr';
import Breadcrumbs from '@/components/BreadCrumbs';
import { PortableText } from '@portabletext/react'
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import dynamic from 'next/dynamic';
import { SanityDocument, groq } from 'next-sanity';
import { GetStaticPaths, GetStaticProps } from 'next';
import { client, getClient, getResizedImage } from '@/sanity/lib/client';
import { PreviewBar } from '@/components/studio/PreviewBar';
import PreviewPhotoGallery from '@/components/studio/PreviewPhotoGallery';


const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const albumQuery = groq`*[_type == "album" && slug.current == $slug][0]{...,category->,images[]{...,"placeholders" : asset->{metadata{lqip}}}}`;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await client.fetch(
    groq`*[_type == "album" && defined(slug.current)][]{
      "params": { "slug": slug.current }
    }`
  );
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const preview = context.draftMode || false;
  const previewToken = preview ? process.env.SANITY_READ_TOKEN : ``;
  const client = getClient(previewToken);

  try {
    const data = await client.fetch(albumQuery, context.params);
    if (!data) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: { data, preview, previewToken },  
      revalidate: 10,
    };
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

const myPortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const src = urlForImage(value).url();
      return (
        <Image width={200} height={200} alt="" quality={75} {...value} src={src} />
      );
    },
  },
};


export default function AlbumPage({
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
      <Breadcrumbs items={[{ "name": data.category.categoryName, "url": "/category/" + data.category.categoryName }, { "name": data.albumName }]
      }></Breadcrumbs>
      <div className='max-w-xl pb-8 mx-auto prose text-center text-sans'>
        <h2>{data.albumName}</h2>
        <PortableText value={data.description} components={myPortableTextComponents} />
      </div>
      {preview && previewToken ? (
        <PreviewProvider previewToken={previewToken}>
          <PreviewPhotoGallery album={data} />
          <PreviewBar />
        </PreviewProvider>
      ) : (
        data && <PhotoGallery mode={data.display} columns={data.columns} images={data.images} albumId={data.slug.current} />
      )}
    </div>
  );
}


