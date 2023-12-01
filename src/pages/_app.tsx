
import React, { ReactNode, ReactElement, useEffect } from "react";
import "styles/globals.css";
import { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};


/*   useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log(document.documentElement.style.getPropertyValue("--p"))
        // Check if color is already in local storage
        
        // Fetch data from Sanity using your client
        const siteColors = await client.fetch('*[_type == "siteSettings"][0]{siteColors->}.siteColors');

        console.log(siteColors)

        // Assuming your data structure is something like siteSettings.primaryColor
        const fetchedPrimaryColor = siteColors.primary.rgb.r + ' ' + siteColors.primary.rgb.g + ' ' + siteColors.primary.rgb.b;
       
          document.documentElement.style.setProperty('--p', fetchedPrimaryColor);
          console.log(document.documentElement.style.getPropertyValue('--p'))

 


      } catch (error) {
        console.error('Error fetching data from Sanity:', error);
      }
    };

    fetchSettings();
  }, []); */

function App({ Component, pageProps }: AppPropsWithLayout) {
const siteMetadata = pageProps.siteMetadata;

  const getLayout = Component.getLayout || ((page) => <Layout siteMetadata={siteMetadata} headerData={pageProps.headerData} context={pageProps.context}>{page}</Layout>);


  return getLayout(<Component {...pageProps} />);
}


export default App;
