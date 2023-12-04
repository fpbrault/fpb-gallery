import { SanityDocument } from "next-sanity";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export default function HomePostMessage({ post }: { post: SanityDocument }) {
  const { t } = useTranslation('common')
  return <div className="p-2 mb-2 rounded sm:mx-1 card bg-base-300">
     <p>{t('home.readPost')}</p>
    <Link
      className="text-2xl font-bold text-center link link-hover link-primary"
      href={"/blog/" + post.slug.current}
    >
      {post?.title ?? "Untitled"}
    </Link>
   
  </div>;
}
