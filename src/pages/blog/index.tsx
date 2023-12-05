import Breadcrumbs from "@/components/BreadCrumbs";
import dynamic from "next/dynamic";
import { SanityDocument, groq } from "next-sanity";
import { GetStaticProps } from "next";
import { PreviewBar } from "@/components/studio/PreviewBar";
import PreviewPostList from "@/components/studio/PreviewPostList";
import { handlePageFetchError } from "@/components/lib/pageHelpers";
import { getPageProps } from "@/components/lib/getPageProps";
import { useState } from 'react';

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
const PostList = dynamic(() => import("@/components/PostList"));

const postsPerPage = 3;


export const postListQuery = groq`*[_type == "post" && defined(slug.current) || defined(slug_fr.current)]  {
  "posts": *[_type == "post" && defined(slug.current) || defined(slug_fr.current)] {
    ...,
    "slug": select(
      $locale == 'en' => coalesce(slug, slug_fr),
      $locale == 'fr' => coalesce(slug_fr, slug)
    ),
    "title": title[_key == $locale].value,
    "blurDataURL": coverImage.asset->.metadata.lqip,
    "excerpt": array::join(
      string::split(
        (pt::text(
          postContent[_key == $locale].value[]
        ))
      , ""
      )[0..255], "") + "..."
  } | order(publishDate desc)[$start..$end],
  "totalCount": count(*[_type == "post" && defined(slug.current) || defined(slug_fr.current)])
}[0]
`;


export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const initialData = await getPageProps(postListQuery, {...context, params: {...context.params, start: 0, end: postsPerPage - 1}});

    return {
      ...initialData,
    };
  } catch (error) {
    return handlePageFetchError(error);
  }
};

export default function BlogPage({
  data,
  context,
  preview,
  previewToken,
}: {
  data: SanityDocument;
  context: any;
  preview: boolean;
  previewToken?: string;
}) {
  const [posts, setPosts] = useState<any>(data.posts);
  const [nextPage, setNextPage] = useState<any>(2);
  const loadMore = async () => {
    // Fetch the next set of posts dynamically
    try {;
      const response = await fetch(`/api/blog/posts?page=${nextPage}&locale=${context?.locale ?? 'en'}&postsPerPage=${postsPerPage ?? 4}`);
      const additionalData = await response.json();
      setNextPage(nextPage + 1)
      setPosts([...posts, ...additionalData]);
    } catch (error) {
      // Handle error when fetching additional data
      console.error("Error loading more posts:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <Breadcrumbs items={[{ name: "blog", url: "/blog" }]} />
      {preview && previewToken ? (
        <PreviewProvider previewToken={previewToken}>
          <PreviewPostList posts={posts} />
          <PreviewBar />
        </PreviewProvider>
      ) : (
        posts && <PostList posts={posts} />
      )}

        {/* Load More button */}
        {posts?.length < data?.totalCount && (
         <button className="mx-auto mt-12 mb-2 btn btn-primary" onClick={loadMore}>Load More</button>
         )}
         </div>
  );
}
