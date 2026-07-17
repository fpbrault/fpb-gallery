import Breadcrumbs from "@/components/Layout/BreadCrumbs";
import { BlogIndex } from "@/features/blog/BlogIndex";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/metadata";
import { getPosts, getSiteShellData } from "@/sanity/data";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { siteMetadata } = await getSiteShellData();
  return createPageMetadata({ locale, path: "/blog", site: siteMetadata, title: "Blog" });
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const data = await getPosts(locale);

  return (
    <div className="flex flex-col justify-center">
      <Breadcrumbs items={[{ name: "blog", url: "/blog" }]} />
      <BlogIndex
        initialPosts={data.posts ?? []}
        locale={locale}
        totalCount={data.totalCount ?? 0}
      />
    </div>
  );
}
