import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import dynamic from "next/dynamic";
import { SanityDocument } from "next-sanity";
import { GetStaticProps } from "next";
import { PreviewBar } from "@/components/studio/PreviewBar";
import PreviewPostList from "@/components/studio/PreviewPostList";
import { handlePageFetchError } from "@/components/lib/pageHelpers";
import { useState } from "react";
import OpenGraphMetadata from "@/components/OpenGraphMetadata";
import { getAllPosts } from "@/sanity/lib/client";
import { getBasePageProps } from "@/components/lib/pageHelpers";

const PreviewProvider = dynamic(() => import("@/components/studio/PreviewProvider"));
const PostList = dynamic(() => import("@/components/Blog/PostList"));

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const initialData = await getAllPosts(context);
    return {
      props: {...(await getBasePageProps(context)), data: {...initialData}},
    };
  } catch (error) {
    return handlePageFetchError(error);
  }
};

export default function BlogPage({
  data,
  context,
  preview,
  previewToken
}: {
  data: SanityDocument;
  context: any;
  preview: boolean;
  previewToken?: string;
}) {
  const [posts, setPosts] = useState<any>(data?.posts);
  const [nextPage, setNextPage] = useState<any>(2);
  const loadMore = async () => {
    // Fetch the next set of posts dynamically
    try {
      const postsPerPage = 3
      const response = await fetch(
        `/api/blog/posts?page=${nextPage}&locale=${context?.locale ?? "en"}&postsPerPage=${
          postsPerPage ?? 4
        }`
      );
      const additionalData = await response.json();
      setNextPage(nextPage + 1);
      setPosts([...posts, ...additionalData]);
    } catch (error) {
      // Handle error when fetching additional data
      console.error("Error loading more posts:", error);
    }
  };

  return (
    <>
      {" "}
      <OpenGraphMetadata title="Blog"></OpenGraphMetadata>
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
          <button className="mx-auto mt-12 mb-2 btn btn-primary" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>
    </>
  );
}
