import React, { ReactNode, useEffect, useState } from "react";
import Head from "next/head";
import { Raleway } from 'next/font/google'
import Header from "./Header";
import ScrollToTopButton from "./ScrollToTop";
import { Footer } from "./Footer";
import { Layout } from "@/types/layout"
import { getSocialIcon } from "./lib/getSocialIcon";

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
})

type Props = {
  children: ReactNode;
  headerData?: any
  siteMetadata?: any
  context?: any;
};


const Layout: React.FC<Props> = (props) => {
  const metadata: Layout.LayoutMetadata = {
    title: props.siteMetadata?.siteTitle ?? "My Site",
    author: props.siteMetadata?.author ?? "Unknown Author",
    description: props.siteMetadata?.description ?? "Description",
    socialLinks: props.siteMetadata?.socialLinks ? props.siteMetadata.socialLinks.map((socialLink: Layout.SocialLink) => { return { "name": socialLink.name, "url": socialLink.url, type: socialLink.type } }) : {
    },


  }
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

      </Head>
     
      <div className={`min-h-screen bg-base-200 text-base-content w-full h-full font-sans transition text-sans flex flex-col ${raleway.variable}`}>
        
        <Header title={metadata.title} contactText={metadata?.socialLinks[0]?.name ?? ""} contactType={metadata?.socialLinks[0]?.type ?? ""} contactUrl={metadata?.socialLinks[0]?.url ?? ""} headerData={props.headerData} context={props.context} />
        <main className="flex-grow w-full h-full px-4 py-4 mx-auto sm:py-4 max-w-7xl">
          {props.children}
        </main>
        <ScrollToTopButton></ScrollToTopButton>

        <Footer metadata={metadata}></Footer>
      </div>
    </>
  );
};
export default Layout;
