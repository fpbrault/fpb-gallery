import { useRouter } from 'next/router';
import useSWR from 'swr';
import Breadcrumbs from '@/components/BreadCrumbs';
import Link from 'next/link';
import Image from "next/image";
import dynamic from 'next/dynamic';
import { SanityDocument, groq } from 'next-sanity';
import { GetStaticPaths, GetStaticProps } from 'next';
import { client, getClient } from '@/sanity/lib/client';
import PostList from '@/components/PostList';
import { PreviewBar } from '@/components/studio/PreviewBar';
import PreviewPostList from '@/components/studio/PreviewPostList';


const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const postListQuery = groq`*[_type == "post" && defined(slug.current)]{...,"blurDataURL": coverImage.asset->.metadata.lqip,"excerpt": array::join(string::split((pt::text(content)), "")[0..255], "") + "..."} | order(publishDate desc)`;



export const getStaticProps: GetStaticProps = async (context) => {
    const preview = context.draftMode || false;
    const previewToken = preview ? process.env.SANITY_READ_TOKEN : ``;
    const client = getClient(previewToken);

    const data = await client.fetch(postListQuery, context.params);
    return { props: { data, preview, previewToken } };
};


export default function BlogPage({
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
                <Breadcrumbs items={[{ "name": "blog", "url": "/blog" }]
                }></Breadcrumbs>
                <PreviewPostList posts={data} />
                <PreviewBar></PreviewBar>
            </PreviewProvider>
        );


    }
    if (data) {
        return <PostList posts={data} />;
    }
    return null;
}
