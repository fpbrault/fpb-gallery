"use client";

import React, { ReactNode } from "react";
import Header, { HeaderSideBar } from "./Header";
import ScrollToTopButton from "./ScrollToTop";
import { Footer } from "./Footer";
import type { Layout } from "@/types/layout";
import { SiteMetadataProvider } from "../context/SiteMetadataContext";
import { getFontFamily } from "./FontLoader";
import { LocaleProvider } from "../context/LocaleContext";
import type { HeaderData, Locale, SiteMetadata } from "@/sanity/types";

type Props = {
  children: ReactNode;
  headerData: HeaderData;
  siteMetadata: SiteMetadata;
  locale: Locale;
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
      : []
  };
  const fontFamily = getFontFamily(props?.siteMetadata?.customFont ?? "raleway");
  const displayFontFamily = getFontFamily(props?.siteMetadata?.customDisplayFont ?? "raleway");
  const customThemeCss = Object.entries({
    [props.siteMetadata.themes.darkThemeName]: props.siteMetadata.customThemeVariables?.dark,
    [props.siteMetadata.themes.lightThemeName]: props.siteMetadata.customThemeVariables?.light
  })
    .filter(([name, values]) => /^[a-zA-Z0-9_-]+$/.test(name) && values)
    .map(
      ([name, values]) =>
        `[data-theme="${name}"]{${Object.entries(values ?? {})
          .map(([variable, value]) => `${variable}:${value}`)
          .join(";")}}`
    )
    .join("");
  const themeInitialization = `(() => {try {const dark=${JSON.stringify(
    props.siteMetadata.themes.darkThemeName
  )};const light=${JSON.stringify(
    props.siteMetadata.themes.lightThemeName
  )};const saved=localStorage.getItem('theme');const theme=saved===dark||saved===light?saved:(matchMedia('(prefers-color-scheme: dark)').matches?dark:light);document.documentElement.dataset.theme=theme;}catch{}})();`;

  return (
    <SiteMetadataProvider siteMetadata={props.siteMetadata}>
      <script dangerouslySetInnerHTML={{ __html: themeInitialization }} />
      {customThemeCss ? <style>{customThemeCss}</style> : null}
      <LocaleProvider locale={props.locale}>
        <div
          style={
            {
              "--font-sans": fontFamily?.style?.fontFamily,
              "--font-display": displayFontFamily?.style?.fontFamily
            } as React.CSSProperties
          }
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
                context={{ locale: props.locale }}
              />

              <main className="flex-grow w-full h-full px-4 mx-auto mb-8 sm:mb-16 max-w-7xl">
                {props.children}
              </main>
            </div>
            <HeaderSideBar headerData={props.headerData} context={{ locale: props.locale }} />
          </div>

          <ScrollToTopButton></ScrollToTopButton>

          <Footer metadata={metadata} />
        </div>
      </LocaleProvider>
    </SiteMetadataProvider>
  );
};
export default Layout;
