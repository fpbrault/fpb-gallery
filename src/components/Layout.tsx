import React, { ReactNode, useEffect, useState } from "react";
import Head from "next/head";
import { Raleway } from 'next/font/google'
import Header from "./Header";
import ScrollToTopButton from "./ScrollToTop";

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
})

type Props = {
  children: ReactNode;
};

export const metadata = {
  title: 'Felix Perron-Brault Photographe',
  description: 'Portfolio',
}

const Layout: React.FC<Props> = (props) => {

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
      <div className={`bg-base min-h-screen text-base-content w-full h-full p-4 font-sans transition text-sans ${raleway.variable}`}>
        <Header title="Felix Perron-Brault | Photographe" contactText="fpbrault" contactUrl="https://www.instagram.com/fpbrault/" />
        <main className="w-full h-full mx-auto max-w-7xl ">
          {props.children}
        </main>
        <ScrollToTopButton></ScrollToTopButton>
        <footer>
          <div className='my-4 font-sans text-sm text-center'>Copyright {new Date().getFullYear()} Felix Perron-Brault. Tout Droits Reservés</div>
        </footer>
      </div>
    </>
  );
};
export default Layout;
