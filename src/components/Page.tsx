import { PortableText } from '@portabletext/react';
import { myPortableTextComponents } from '../pages/blog/[slug]';
import { SanityDocument } from 'next-sanity';

export default function Page({ page }: { page: SanityDocument }) {
  return (<div className='max-w-4xl mx-auto font-sans text-center text-base-content'>
    <div className='px-4 mx-auto prose text-left lg:prose-xl prose-headings:text-center' key={page?.slug}>
        <PortableText value={page?.content} components={myPortableTextComponents} /></div>
  </div>);
}