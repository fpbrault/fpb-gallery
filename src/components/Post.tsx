import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { myPortableTextComponents } from '../pages/blog/[slug]';
import { SanityDocument } from 'next-sanity';
import { urlForImage } from '@/sanity/lib/image';
import { getResizedImage } from '@/sanity/lib/client';

export default function Post({ post }: { post: SanityDocument }) {
  const height = 750
  const image = getResizedImage(post.coverImage, 80, height)
  return (<div className='max-w-4xl mx-auto font-sans prose text-center lg:prose-xl text-base-content'>
    <article key={post?.slug}>
      <div className='p-4 text-4xl font-bold'>{post?.title}</div>
      <span className='font-mono text-lg'>
        {new Date(post?.publishDate).toLocaleDateString()}
      </span>
       {image ?
      <Image className='max-w-3xl mx-auto' blurDataURL={post?.blurDataURL} placeholder='blur' height={image?.imageHeight} width={image?.imageWidth} alt="alt" src={image?.imageUrl}></Image> : null}

      <div className='px-4'>
        <PortableText value={post?.content} components={myPortableTextComponents} /></div>
    </article>

  </div>);
}