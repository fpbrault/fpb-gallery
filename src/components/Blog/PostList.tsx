import Image from "next/image";
import { SanityDocument } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";

export default function Post({ posts }: { posts: SanityDocument }) {
  const width = 1000;
  const height = 600;
  return (
    (<div className="text-center text-base-content text-sans">
      <h2 className="pb-4 text-4xl font-bold font-display"></h2>
      {posts.length > 0 &&
        posts?.map((post: any, index: number) => {
          const imageUrl = post.coverImage
            ? urlForImage(post.coverImage).height(height).width(width).quality(80).url()
            : null;
          return (
            (<div className="" key={post.slug.current}>
              <article className="max-w-xl mx-auto lg:max-w-5xl card lg:card-side">
                <Link href={"/blog/" + post.slug.current}>
                  <Image
                    unoptimized
                    className="max-w-lg mx-auto rounded shadow-lg lg:max-w-lg sm:max-w-md "
                    blurDataURL={post.blurDataURL}
                    placeholder={post.blurDataURL ? "blur" : "empty"}
                    width={width}
                    height={height}
                    src={
                      imageUrl ??
                      "https://placehold.co/1000x750/jpg?text=" +
                        (post.title
                          ? (post.title[0].length >= 60
                              ? post.title[0].substring(0, 60) + "..."
                              : post.title[0]
                            ).replace(/ /g, "+")
                          : "No+Image")
                    }
                    alt="cover image placeholder"
                  />
                </Link>
                <div className="items-center max-w-lg mx-auto card-body">
                  <h2 className="card-title font-display">
                    <Link
                      className="text-2xl font-bold text-center link link-hover link-primary"
                      href={"/blog/" + post.slug.current}
                    >
                      {post?.title ?? "Untitled"}
                    </Link>
                  </h2>
                  <span className="badge badge-outline">
                    {new Date(post.publishDate).toDateString()}
                  </span>
                  <div className="justify-end card-actions">
                    {post.tags &&
                      post.tags.map((tag: string) => (
                        <div key={tag} className="badge badge-secondary badge-outline">
                          {tag}
                        </div>
                      ))}
                  </div>
                  <p className="w-full max-w-sm pt-8 leading-relaxed text-left">
                    {post.excerpt ?? "No excerpt"}
                  </p>
                </div>
              </article>
              {index < posts.length - 1 && (
                <div className="flex flex-col w-full pt-4 pb-8">
                  <div className="divider divider-primary"></div>
                </div>
              )}
            </div>)
          );
        })}
    </div>)
  );
}
