
import React, { ReactNode, ReactElement, useEffect } from "react";
import "styles/globals.css";
import { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { NextPage } from "next";
import { client } from "@/sanity/lib/client";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

 /*  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Check if color is already in local storage
        const storedPrimaryColor = localStorage.getItem('primaryColor');
        document.documentElement.style.setProperty('--color-primary', storedPrimaryColor);

        // Fetch data from Sanity using your client
        const siteColors = await client.fetch('*[_type == "siteSettings"][0]{siteColors->}.siteColors');

        // Assuming your data structure is something like siteSettings.primaryColor
        const fetchedPrimaryColor = siteColors.primary.rgb.r + ' ' + siteColors.primary.rgb.g + ' ' + siteColors.primary.rgb.b;

        if (!storedPrimaryColor || fetchedPrimaryColor !== storedPrimaryColor) {
          // Dynamically set the CSS variable
          document.documentElement.style.setProperty('--color-primary', fetchedPrimaryColor);

          // Save the fetched color to local storage
          localStorage.setItem('primaryColor', fetchedPrimaryColor);
        }

      } catch (error) {
        console.error('Error fetching data from Sanity:', error);
      }
    };

    fetchSettings();
  }, []); */


  return (
    getLayout(
      <Component {...pageProps} />
    )
  )
}

export default App;
