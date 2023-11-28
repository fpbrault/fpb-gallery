import Breadcrumbs from '@/components/BreadCrumbs';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import Post from '../../components/Post';
import PreviewPost from '../../components/studio/PreviewPost';
import { SanityDocument, groq } from 'next-sanity';
import dynamic from 'next/dynamic';
import { GetStaticPaths, GetStaticProps } from 'next';
import { client, getClient } from '@/sanity/lib/client';
import { PreviewBar } from '@/components/studio/PreviewBar';

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{...,content[]{...,_type == "album" =>{...}->{albumName,albumId,images[]{...,asset->}}},"blurDataURL": coverImage.asset->.metadata.lqip}`;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][]{
      "params": { "slug": slug.current }
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
  return { props: { data, preview, previewToken } };
};

export const myPortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const src = urlForImage(value).url();
      return (
        <Image width={200} height={200} alt="" quality={75} {...value} src={src} />
      );
    },
    album: ({ value }: any) => {
      const src = urlForImage(value.images[0]).url();
      return (<Link className=" link link-primary link-hover" href={'/album/' + value.albumId}>
        <div className='flex justify-between w-full max-w-sm mx-auto transition border rounded-xl bg-primary text-primary-content border-primary hover:bg-primary-content hover:text-primary'>
          <span className='self-center flex-grow px-2 font-bold text-center truncate'> {value.albumName}</span>
          <Image style={{ margin: 0 }} className='w-32 h-16 m-0 rounded-r-xl' width={100} height={100} alt="" quality={75} src={src} />
        </div></Link>)
    },

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
  if (preview && previewToken) {
    return (
      <PreviewProvider previewToken={previewToken}>
          <Breadcrumbs items={[{ "name": "blog", "url": "/blog" }, { "name": data.title }]
      }></Breadcrumbs>
        <PreviewPost post={data} />
        <PreviewBar></PreviewBar>
      </PreviewProvider>
    );

  
  }
  if (data){
  return <Post post={data} />;}
  return null;
}