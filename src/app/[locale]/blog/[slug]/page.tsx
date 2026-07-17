import { notFound, permanentRedirect } from "next/navigation";

import Post from "@/components/Blog/Post";
import { PostNavigation } from "@/components/Blog/PostNavigation";
import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import { isLocale, localizePath } from "@/i18n/config";
import { createPageMetadata } from "@/lib/metadata";
import { getPost, getPostSlugs, getSiteShellData } from "@/sanity/data";

export async function generateStaticParams() {
  const posts = await getPostSlugs();
  return posts.flatMap((post) => [
    ...(post.slug ? [{ locale: "en", slug: post.slug }] : []),
    ...(post.slugFr ? [{ locale: "fr", slug: post.slugFr }] : [])
  ]);
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const [data, { siteMetadata }] = await Promise.all([getPost(slug, locale), getSiteShellData()]);
  if (!data?.current) return {};
  return createPageMetadata({
    locale,
    path: `/blog/${slug}`,
    site: siteMetadata,
    title: data.current.title
  });
}

export default async function BlogPostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPost(slug, locale);
  if (!data?.current) notFound();

  if (data.current.slug.current !== slug) {
    permanentRedirect(localizePath(`/blog/${data.current.slug.current}`, locale));
  }

  return (
    <div>
      <Breadcrumbs items={[{ name: "blog", url: "/blog" }, { name: data.current.title }]} />
      <Post post={data.current} />
      <PostNavigation data={data} />
    </div>
  );
}
