"use client";

import Image from "next/image";
import { RichText } from "@/components/PortableText/RichText";
import { getResizedImage } from "@/sanity/lib/image";
import type { Post as PostData } from "@/features/blog/models";

export default function Post({ post }: { post: PostData }) {
  const height = 1000;
  const image = post?.coverImage ? getResizedImage(post.coverImage, 80, height) : null;
  return (
    <div className="max-w-6xl mx-auto font-sans text-center text-base-content">
      <article key={post.slug}>
        <div className="max-w-4xl mx-auto">
          {image ? (
            <Image
              className="mx-auto rounded shadow-2xl max-h-[750px] object-contain max-w-fit"
              blurDataURL={post?.blurDataURL ?? ""}
              placeholder="blur"
              height={image?.imageHeight ?? ""}
              width={image?.imageWidth ?? ""}
              alt={post.title}
              src={image?.imageUrl ?? ""}
            ></Image>
          ) : null}
        </div>

        <h2 className="p-4 text-4xl font-bold font-display text-primary">{post?.title}</h2>
        {post.publishDate ? (
          <div className="font-mono text-sm ">{new Date(post.publishDate).toDateString()}</div>
        ) : null}
        <div className="divider"></div>

        <div className="px-4 mx-auto prose text-left lg:prose-xl prose-headings:text-center">
          <RichText value={post.content} />
        </div>
      </article>
    </div>
  );
}
