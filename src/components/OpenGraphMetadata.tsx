import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSiteMetadata } from "./context/SiteMetadataContext";

const constructOgImageUrl = (title: any, slug: any) => {
  const queryParams = [];
  if (title) queryParams.push(`pageTitle=${encodeURIComponent(title)}`);
  if (slug) queryParams.push(`slug=${encodeURIComponent(slug)}`);
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/og${queryString}`;
};

const OpenGraphMetadata = ({ title, slug }: any) => {
  const router = useRouter();
  const { asPath } = router;
  const siteMetadata = useSiteMetadata()
  const ogImageUrl = constructOgImageUrl(title, slug);

  const ogTitle = `${siteMetadata.siteTitle}${title && " - " + title}`;
  return (
    <Head>
      <meta property="og:image" content={ogImageUrl} />
      {/* <title>{ogTitle}</title> */}
      <meta name="description" content={siteMetadata.description} />
      <title>{ogTitle}</title>
      <meta property="og:url" content={`https://${process.env.NEXT_PUBLIC_HOSTNAME ?? process.env.NEXT_PUBLIC_VERCEL_URL}${asPath}`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={siteMetadata.description} />
      <meta property="og:image" content={ogImageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={process.env.NEXT_PUBLIC_HOSTNAME ?? process.env.NEXT_PUBLIC_VERCEL_URL} />
      <meta
        property="twitter:url"
        content={`https://${process.env.NEXT_PUBLIC_HOSTNAME ?? process.env.NEXT_PUBLIC_VERCEL_URL}${asPath}`}
      />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={siteMetadata.description} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Head>
  );
};

export default OpenGraphMetadata;
