// pages/album/[albumId].tsx
import { useRouter } from 'next/router';
import PhotoGallery from '@/components/PhotoGallery';
import Breadcrumbs from '@/components/BreadCrumbs';
import { PortableText } from '@portabletext/react'
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import dynamic from 'next/dynamic';
import {  groq } from 'next-sanity';
import { GetStaticProps } from 'next';

import { PreviewBar } from '@/components/studio/PreviewBar';
import PreviewPhotoGallery from '@/components/studio/PreviewPhotoGallery';
import { getBasePageProps } from '@/components/lib/getBasePageProps';


const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const albumQuery = groq`*[_type == "album"]{...,category->,images[]
  {...,"placeholders" : asset->{metadata{lqip}}}}.images[]`;


export const getStaticProps: GetStaticProps = async (context) => {

  try {
    const { data, preview, previewToken, siteMetadata, headerData } = await getBasePageProps(context, albumQuery);

    if (!data) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: { data, preview, previewToken, siteMetadata, headerData, context },  
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
        <Image unoptimized width={200} height={200} alt="" quality={75} {...value} src={src} />
      );
    },
  },
};


export default function AlbumPage({
  data,
  preview,
  previewToken,
}: {
  data: any;
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
      <Breadcrumbs items={[ { "name": 'everything' }]
      }></Breadcrumbs>
      <div className='max-w-xl pb-8 mx-auto prose text-center text-sans'>
        <h2>All Photos</h2>
        <PortableText value={data.description} components={myPortableTextComponents} />
      </div>
      {preview && previewToken ? (
        <PreviewProvider previewToken={previewToken}>
          <PreviewPhotoGallery album={data} />
          <PreviewBar />
        </PreviewProvider>
      ) : (
        data && <PhotoGallery mode="masonry" columns={data.columns} images={data} albumId="all" />
      )}
    </div>
  );
}


