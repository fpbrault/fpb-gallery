import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { myPortableTextComponents } from '../pages/blog/[slug]';
import { SanityDocument } from 'next-sanity';
import { urlForImage } from '@/sanity/lib/image';
import { getResizedImage } from '@/sanity/lib/client';
import Link from 'next/link';

export default function Post({ posts }: { posts: SanityDocument }) {
  const width = 1000;
  const height = 750
  
  return (<div className='text-center text-base-content text-sans'>
    <h2 className='pb-4 text-4xl font-bold'>Posts</h2>
    {posts.map((post: any) => {

      const imageUrl = post.coverImage ? urlForImage(post.coverImage).height(height).width(width).quality(80).url() : null;

      return (
        <article key={post.slug.current} className="max-w-xl mx-auto mb-8 shadow-xl card bg-base-200">
          <Link href={"/blog/" + post.slug.current}><Image className='rounded-t-2xl' blurDataURL={post.blurDataURL} placeholder={post.blurDataURL ? 'blur' : "empty"} width={width} height={height} src={imageUrl ?? "https://placehold.co/1000x750/jpg"} alt="Shoes" /></Link>
          <div className="items-center card-body">
            <h2 className="card-title">
              <Link className='text-2xl font-bold text-center link link-hover link-primary' href={"/blog/" + post.slug.current}>{post.title ?? "Untitled"}</Link>
            </h2>
            <span className='badge badge-secondary badge-outline'>
              {new Date(post.publishDate).toLocaleDateString()}
            </span>
            <p> {post.excerpt ?? "No excerpt"}</p>

            <div className="justify-end card-actions">
               {post.tags && post.tags.map((tag: string) => {
                return (<div key={tag} className="badge badge-outline">{tag}</div>)
              })}

            </div>
          </div>




        </article>
      )
    })}
  </div>);
}