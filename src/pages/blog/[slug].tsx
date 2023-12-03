import Breadcrumbs from '@/components/BreadCrumbs';
import Post from '../../components/Post';
import PreviewPost from '../../components/studio/PreviewPost';
import { SanityDocument, groq } from 'next-sanity';
import dynamic from 'next/dynamic';
import { GetStaticPaths, GetStaticProps } from 'next';
import { client, getClient, getResizedImage } from '@/sanity/lib/client';
import { PreviewBar } from '@/components/studio/PreviewBar';
import { useRouter } from 'next/router';
import React from 'react';
import { PostNavigation } from '../../components/PostNavigation';
import { getBasePageProps } from '@/components/lib/getBasePageProps';

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const postQuery = groq`*[_type == "post" && (slug.current == $slug || slug_fr.current == $slug)] {"current": {...,"slug": select(
  $locale == 'en' => coalesce(slug, slug_fr),
  $locale == 'fr' => coalesce(slug_fr, slug)
), 
  "postContent": postContent[_key == $locale]{value[]
    {...,
      _type == "Post"=>{...}->{coverImage{...,asset->}, title[_key == $locale]},
      _type == "album" || _type == "albumCard" =>{...}->{albumName,albumId,images[0]{...,asset->}}}}
  ,"title": title[_key == $locale][0].value,
    "blurDataURL": coverImage.asset->.metadata.lqip
}
,"previous": *[_type == "post" && ^.publishDate > publishDate]|order(publishDate desc)[0]{ 
  "slug": select(
    $locale == 'en' => coalesce(slug, slug_fr),
    $locale == 'fr' => coalesce(slug_fr, slug)
  ), "title": title[_key == $locale][0].value, publishDate, tags[], coverImage
},"next": *[_type == "post" && ^.publishDate < publishDate]|order(publishDate asc)[0]{ 
"slug": select(
    $locale == 'en' => coalesce(slug, slug_fr),
    $locale == 'fr' => coalesce(slug_fr, slug)
  ), "title": title[_key == $locale][0].value, publishDate, tags[], coverImage
}
} [0]`;

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][]{
      "params": { "slug": slug.current,"slug_fr": slug_fr.current }
    }`
  );
  const pathLocales: any[] = []

  paths.map((element: { params: { slug: string, slug_fr: string }; }) => {
    return locales?.map((locale) => {
      const slugName = locale == "en" ? "slug" : "slug_fr";
      const slugForLocale = slugName ? element.params[slugName] : null;
      if (slugForLocale) {
        return pathLocales.push({
          params: { slug: `${slugForLocale}`},
          locale,
        })
      }
    })
  })
  return { paths: pathLocales, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (context) => {


  try {
    const { data, preview, previewToken, siteMetadata, headerData } = await getBasePageProps(context, postQuery);



    if (!data) {
      return {
        redirect: {
          destination: '/blog',
          permanent: false,
        },
      };
    }

    const slugName = context.locale == "en" ? "slug" : "slug_fr";
    const currentLocale = { slug: data.current[slugName]}
    const otherLocale = { slug: data.current[slugName == 'slug' ? 'slug_fr' : 'slug']}
     try {
      if (currentLocale?.slug?.current && (currentLocale?.slug?.current != context?.params?.slug)) {
        return {
          redirect: {
            destination: '/' + (context.locale != 'en' ? (context.locale + '/') : "") + 'blog/' + currentLocale?.slug?.current,
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
        destination: '/blog',
        permanent: false,
      },
    };
  }
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
      <Breadcrumbs items={[{ "name": "blog", "url": "/blog" }, { "name": data.current.title }]
      }></Breadcrumbs>
      {preview && previewToken ? (
        <PreviewProvider previewToken={previewToken}>
          <PreviewPost post={data.current} />
          <PostNavigation data={data}></PostNavigation>
          <PreviewBar />
        </PreviewProvider>
      ) : (
        data && <>
          <Post post={data.current} />
          <PostNavigation data={data}></PostNavigation>
        </>
      )}
    </div>
  );
}

