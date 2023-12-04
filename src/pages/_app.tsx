import React, { ReactNode, ReactElement, useEffect } from "react";
import "styles/globals.css";
import { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { NextPage } from "next";
import { appWithTranslation } from 'next-i18next'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const siteMetadata = pageProps.siteMetadata;
  useEffect(() => {
    const darkThemeVariables = siteMetadata?.customThemeVariables?.customDarkThemeVariables ?? null;
    const lightThemeVariables = siteMetadata?.customThemeVariables?.customLightThemeVariables ?? null;
    const lightThemeName = siteMetadata?.themes?.lightThemeName ?? 'light';
    const darkThemeName = siteMetadata?.themes?.darkThemeName ?? 'mytheme';

    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.textContent = ""
    if (darkThemeVariables) {
      styleElement.textContent = styleElement.textContent.concat(`
      [data-theme="${darkThemeName}"] {
        ${Object.entries(darkThemeVariables)
          .map(([variable, value]) => `${variable}: ${value};`)
          .join('\n')}
      }
    `)
    }

    if (lightThemeVariables) {
      styleElement.textContent = styleElement.textContent.concat(`
    [data-theme="${lightThemeName}"] {
      ${Object.entries(lightThemeVariables)
          .map(([variable, value]) => `${variable}: ${value};`)
          .join('\n')}
      }
    `)
    }
    // Append the style element to the document head
    document.head.appendChild(styleElement);

    return () => {
      // Clean up the style element when the component is unmounted
      document.head.removeChild(styleElement);
    };
  }, [siteMetadata?.customThemeVariables, siteMetadata?.themes?.darkThemeName, siteMetadata?.themes?.lightThemeName]);

  
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <Layout
        siteMetadata={siteMetadata}
        headerData={pageProps.headerData}
        context={pageProps.context}
      >
        {page}
      </Layout>
    ));

  return getLayout(<Component {...pageProps} />);
}


export default appWithTranslation(App);
