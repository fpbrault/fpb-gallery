import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import Layout from "@/components/Layout/Layout";
import { VisualEditingPreview } from "@/components/VisualEditingPreview";
import { isLocale, locales } from "@/i18n/config";
import { getSiteUrl } from "@/lib/metadata";
import { getSiteShellData } from "@/sanity/repositories/siteRepository";
import { SanityLive } from "@/sanity/lib/live";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [{ isEnabled }, shell] = await Promise.all([draftMode(), getSiteShellData(locale)]);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    inLanguage: locale,
    name: shell.siteMetadata.siteTitle,
    url: getSiteUrl().toString(),
    author: {
      "@type": "Person",
      name: shell.siteMetadata.author
    }
  };

  return (
    <Layout locale={locale} headerData={shell.headerData} siteMetadata={shell.siteMetadata}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
        }}
      />
      {children}
      <SanityLive />
      {isEnabled && <VisualEditingPreview />}
    </Layout>
  );
}
