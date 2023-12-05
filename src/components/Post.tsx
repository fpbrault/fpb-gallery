import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { myPortableTextComponents } from "@/components/PortableText/myPortableTextComponents";
import { SanityDocument } from "next-sanity";
import { getResizedImage } from "@/sanity/lib/client";

export default function Post({ post }: { post: SanityDocument }) {
  const height = 1000;
  const image = post?.coverImage ? getResizedImage(post.coverImage, 80, height) : null;
  return (
    <div className="max-w-6xl mx-auto font-sans text-center text-base-content">
      <article key={post?.slug}>
        <div className="max-w-4xl mx-auto">
          {image ? (
            <Image
              unoptimized
              className="mx-auto rounded shadow-2xl max-h-[750px] object-contain max-w-fit"
              blurDataURL={post?.blurDataURL ?? ""}
              placeholder="blur"
              height={image?.imageHeight ?? ""}
              width={image?.imageWidth ?? ""}
              alt="alt"
              src={image?.imageUrl ?? ""}
            ></Image>
          ) : null}
        </div>

        <h2 className="p-4 text-4xl font-bold text-primary">{post?.title}</h2>
        <div className="font-mono text-sm ">{new Date(post?.publishDate).toDateString()}</div>
        <div className="divider"></div>

        <div className="px-4 mx-auto prose text-left lg:prose-xl prose-headings:text-center">
          <PortableText
            value={post?.postContent && post?.postContent[0]?.value}
            components={myPortableTextComponents as any}
          />
        </div>
      </article>
    </div>
  );
}
