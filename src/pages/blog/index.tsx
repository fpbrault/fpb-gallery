
import Breadcrumbs from '@/components/BreadCrumbs';
import dynamic from 'next/dynamic';
import { SanityDocument, groq } from 'next-sanity';
import { GetStaticProps } from 'next';
import PostList from '@/components/PostList';
import { PreviewBar } from '@/components/studio/PreviewBar';
import PreviewPostList from '@/components/studio/PreviewPostList';
import { getBasePageProps } from '@/components/lib/getBasePageProps';


const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
export const postListQuery = groq`*[_type == "post" && defined(slug.current) || defined(slug_fr.current)]{...,"slug": select(
    $locale == 'en' => coalesce(slug, slug_fr),
    $locale == 'fr' => coalesce(slug_fr, slug)
  ),
    
    "title": title[_key == $locale].value,"blurDataURL": coverImage.asset->.metadata.lqip,"excerpt":array::join(
    string::split(
      (pt::text(
        postContent[_key == $locale].value[]
      )
    )
  , ""
    )[0..255], "") + "..."} | order(publishDate desc)`;



export const getStaticProps: GetStaticProps = async (context) => {
    const contextWithParams = {...context, params: {}}
  
    const { data, preview, previewToken, siteMetadata, headerData } = await getBasePageProps(contextWithParams, postListQuery); 
    return { props: { data, preview, previewToken, siteMetadata, headerData, context}, revalidate: 10 };
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
