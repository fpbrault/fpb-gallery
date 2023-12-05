import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { myPortableTextComponents } from "@/components/myPortableTextComponents";
import { SanityDocument } from "next-sanity";
import { getResizedImage } from "@/sanity/lib/client";

export default function Post({ post }: { post: SanityDocument }) {
  const height = 750;
  const image = post?.coverImage ? getResizedImage(post.coverImage, 80, height) : null;
  return (
    <div className="max-w-6xl mx-auto font-sans text-center text-base-content">
      <article key={post?.slug}>
        {image ? (
          <Image
            unoptimized
            className="max-w-3xl mx-auto rounded shadow-2xl"
            blurDataURL={post?.blurDataURL?? ""}
            placeholder="blur"
            height={image?.imageHeight?? ""}
            width={image?.imageWidth?? ""}
            alt="alt"
            src={image?.imageUrl ?? ""}
          ></Image>
        ) : null}

        <h2 className="p-4 text-4xl font-bold text-primary">{post?.title}</h2>
        <div className="text-sm ont-mono ">{new Date(post?.publishDate).toDateString()}</div>
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
