import React, { ReactNode, useEffect } from "react";
import Head from "next/head";
import Header, { HeaderSideBar } from "./Header";
import ScrollToTopButton from "./ScrollToTop";
import { Footer } from "./Footer";
import { Layout } from "@/types/layout";
import { SiteMetadataProvider } from "../context/SiteMetadataContext";
import { PagePropsProvider } from "../context/PagePropsContext";
import { getFontFamily } from "./FontLoader";


type Props = {
  children: ReactNode;
  headerData?: any;
  siteMetadata?: any;
  context?: any;
};

const Layout: React.FC<Props> = (props) => {
  const metadata: Layout.LayoutMetadata = {
    title: props.siteMetadata?.siteTitle ?? "My Site",
    author: props.siteMetadata?.author ?? "Unknown Author",
    description: props.siteMetadata?.description ?? "Description",
    socialLinks: props.siteMetadata?.socialLinks
      ? props.siteMetadata.socialLinks.map((socialLink: Layout.SocialLink) => {
          return { name: socialLink.name, url: socialLink.url, type: socialLink.type };
        })
      : {}
  };
  const fontFamily = getFontFamily(props?.siteMetadata?.customFont ?? 'raleway');
  const displayFontFamily = getFontFamily(props?.siteMetadata?.customDisplayFont ?? 'raleway');

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>{metadata.title}</title>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <SiteMetadataProvider siteMetadata={props.siteMetadata}>
        <PagePropsProvider pageProps={props.context}>
          <div style={{ "--font-sans": fontFamily?.style?.fontFamily, "--font-display": displayFontFamily?.style?.fontFamily} as React.CSSProperties }
            className={`min-h-screen bg-base-200 text-base-content w-full h-full font-sans transition text-sans flex flex-col`}
          >
            <div className="flex-grow h-full drawer ">
              <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
              <div className="flex flex-col drawer-content">
                {/* Navbar */}
                <Header
                  title={metadata.title}
                  contactText={metadata?.socialLinks[0]?.name ?? ""}
                  contactType={metadata?.socialLinks[0]?.type ?? ""}
                  contactUrl={metadata?.socialLinks[0]?.url ?? ""}
                  headerData={props && props.headerData}
                  context={props.context}
                />

                <main className="flex-grow w-full h-full px-4 mx-auto mb-8 sm:mb-16 max-w-7xl">
                  {props.children}
                </main>
              </div>
              <HeaderSideBar headerData={props.headerData} context={props.context}></HeaderSideBar>
            </div>

            <ScrollToTopButton></ScrollToTopButton>

            <Footer context={props.context} metadata={metadata}></Footer>
          </div>
        </PagePropsProvider>
      </SiteMetadataProvider>
    </>
  );
};
export default Layout;
