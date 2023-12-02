import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import React from 'react';
4

export const myPortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const src = urlForImage(value).url();
      return (
        <Image className='rounded shadow-2xl' unoptimized width={200} height={200} alt="" quality={75} {...value} src={src} />
      );
    },
    album: ({ value }: any) => {
      const src = urlForImage(value.images).width(128).height(64).url();
      return (<div className='w-full max-w-sm mx-auto shadow-xl'>
        <span className='text-sm'>Related Album:</span>
        <Link className="link link-primary link-hover" href={'/album/' + value.albumId}>
          <div className='flex w-full max-w-sm mx-auto transition border justify-evenly rounded-xl bg-primary text-primary-content border-primary hover:bg-primary-content hover:text-primary'>

            <span className='self-center flex-grow px-2 font-bold text-center '> {value.albumName}</span>
            <Image unoptimized style={{ margin: 0 }} className='w-32 h-16 m-0 rounded-xl' width={128} height={64} alt="" quality={75} src={src} />
          </div></Link>
      </div>);
    },
    Post: ({ value }: any) => {
      const src = urlForImage(value.coverImage).width(128).height(64).url();
      return (<div className='w-full max-w-sm mx-auto shadow-xl'>
        <span className='text-sm'>Related Album:</span>
        <Link className="link link-primary link-hover" href={'/album/' + value.albumId}>
          <div className='flex justify-between w-full max-w-sm mx-auto transition border rounded-xl bg-primary text-primary-content border-primary hover:bg-primary-content hover:text-primary'>

         
             <Image unoptimized style={{ margin: 0 }} className='w-32 h-16 m-0 rounded-xl' width={128} height={64} alt="" quality={75} src={src ?? ""} />   <span className='self-center flex-grow px-2 text-base font-bold text-center max-h-12 line-clamp-2 '> {value.title[0]?.value?.slice(0,100) ?? "Article"}</span>
          </div></Link>
      </div>);
    },
  }
};
