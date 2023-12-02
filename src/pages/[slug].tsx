import Breadcrumbs from '@/components/BreadCrumbs';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { SanityDocument, groq } from 'next-sanity';
import dynamic from 'next/dynamic';
import { GetStaticPaths, GetStaticProps } from 'next';
import { client, getClient } from '@/sanity/lib/client';
import { PreviewBar } from '@/components/studio/PreviewBar';
import { useRouter } from 'next/router';
import React from 'react';
import PreviewPage from '@/components/studio/PreviewPage';
import Page from '@/components/Page';
import { getBasePageProps } from '@/components/lib/getBasePageProps';



const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const pageQuery = groq`*[_type == "page" && slug.current == $slug && (language == $locale || language == "en" || language == "fr")][0]{  
  ...{"_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    slug,
    title,
    language
  }},content[]
  {...,_type == "album" =>{...}->{albumName,albumId,images[]{...,asset->}}},
    "blurDataURL": coverImage.asset->.metadata.lqip
}`;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await client.fetch(
    groq`*[_type == "page" && defined(slug.current)][]{
      "params": {"slug": slug.current, "locale": language, "name": name }, "locale": language,
    }`
  );
  return { paths, fallback: 'blocking' };
};




export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const { data, preview, previewToken, siteMetadata, headerData } = await getBasePageProps(context, pageQuery);

    if (!data) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    const otherLocale = data._translations.find((translation: { language: string; }) => translation.language != context.locale) ?? null;
    const currentLocale = data._translations.find((translation: { language: string; }) => translation.language == context.locale) 

    try {
      if (currentLocale?.slug?.current && (currentLocale?.slug?.current != context?.params?.slug)) {
        return {
          redirect: {
            destination: '/' + (context.locale != 'en' ? (context.locale + '/') : null) + currentLocale?.slug?.current,
            permanent: false,
          },
        };
      }
    }
    catch (error) {
      console.error(error)
    }
    const contextWithOtherLocale = { ...context, otherLocale };

    return {
      props: { data, preview, previewToken, siteMetadata, headerData, context: contextWithOtherLocale }, revalidate: 10,
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

export const myPortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const src = urlForImage(value).url();
      return (
        <Image unoptimized width={200} height={200} alt="" quality={75} {...value} src={src} />
      );
    },
    album: ({ value }: any) => {
      const src = urlForImage(value.images[0]).url();
      return (<Link className=" link link-primary link-hover" href={'/album/' + value.albumId}>
        <div className='flex justify-between w-full max-w-sm mx-auto transition border rounded-xl bg-primary text-primary-content border-primary hover:bg-primary-content hover:text-primary'>
          <span className='self-center flex-grow px-2 font-bold text-center truncate'> {value.albumName}</span>
          <Image unoptimized style={{ margin: 0 }} className='w-32 h-16 m-0 rounded-r-xl' width={100} height={100} alt="" quality={75} src={src} />
        </div></Link>)
    },

  }
};

export default function CustomPage({
  data,
  preview,
  previewToken
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
      {preview && previewToken ? (
        <PreviewProvider previewToken={previewToken}>
          <PreviewPage page={data} />
          <PreviewBar />
        </PreviewProvider>
      ) : (
        data && <>
          <Page page={data} />
        </>
      )}
    </div>
  );
}

