
import Breadcrumbs from '@/components/BreadCrumbs';
import dynamic from 'next/dynamic';
import { SanityDocument, groq } from 'next-sanity';
import { GetStaticProps } from 'next';
import { getClient } from '@/sanity/lib/client';
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
    return { props: { data, preview, previewToken }, revalidate: 10 };
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
    return (
        <div>
            <Breadcrumbs items={[{ "name": "blog", "url": "/blog" }]} />
            {preview && previewToken ? (
                <PreviewProvider previewToken={previewToken}>
                    <PreviewPostList posts={data} />
                    <PreviewBar />
                </PreviewProvider>
            ) : (
                data && <PostList posts={data} />
            )}
        </div>
    );
}

