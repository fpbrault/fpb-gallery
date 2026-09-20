"use client";

import type { ReactNode } from "react";
import type { HeaderData, SiteMetadata } from "@/features/site/models";
import type { Locale } from "@/i18n/config";
import type { Layout as LayoutTypes } from "@/types/layout";
import { LocaleProvider } from "../context/LocaleContext";
import { Footer } from "./Footer";
import Header, { HeaderSideBar } from "./Header";
import ScrollToTopButton from "./ScrollToTop";

type Props = {
  children: ReactNode;
  headerData: HeaderData;
  siteMetadata: SiteMetadata;
  locale: Locale;
};

const Layout = (props: Props) => {
  const metadata: LayoutTypes.LayoutMetadata = {
    title: props.siteMetadata?.siteTitle ?? "My Site",
    author: props.siteMetadata?.author ?? "Unknown Author",
    description: props.siteMetadata?.description ?? "Description",
    socialLinks: props.siteMetadata?.socialLinks
      ? props.siteMetadata.socialLinks.map((socialLink: LayoutTypes.SocialLink) => {
          return { name: socialLink.name, url: socialLink.url, type: socialLink.type };
        })
      : []
  };
  return (
    <LocaleProvider locale={props.locale}>
      <div className="min-h-screen bg-base-200 text-base-content w-full h-full font-sans transition text-sans flex flex-col">
        <div className="flex-grow h-full drawer ">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="flex flex-col drawer-content">
            {/* Navbar */}
            <Header title={metadata.title} headerData={props.headerData} />

            <main className="flex-grow w-full h-full px-4 mx-auto mb-8 sm:mb-16 max-w-7xl">
              {props.children}
            </main>
          </div>
          <HeaderSideBar headerData={props.headerData} />
        </div>

        <ScrollToTopButton></ScrollToTopButton>

        <Footer metadata={metadata} />
      </div>
    </LocaleProvider>
  );
};
export default Layout;
