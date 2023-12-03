import React from "react";
import Link from "next/link";
import ThemeSelector from "./ThemeSelector";
import { getSocialIcon } from "./lib/getSocialIcon";

type HeaderLink = {
  title: string;
  slug: string;
  _translations: any;
};

type Props = {
  title: string;
  contactUrl: string;
  contactText: string;
  contactType: string;
  headerData: Array<HeaderLink>;
  context: any;
};

export default function Header({
  title,
  contactUrl,
  contactText,
  contactType,
  headerData,
  context
}: Props) {
  const icon = getSocialIcon(contactType);
  return (
    <header className="sticky top-0 z-50 flex flex-col w-full p-2 px-4 mx-auto rounded sm:py-3 lg:py-4 bg-base-200/70 backdrop-blur-lg">
      <h1 className="py-1 font-sans text-2xl font-light text-center sm:text-4xl lg:text-5xl">
        <Link className="link link-hover" href="/">
          {title}
        </Link>
      </h1>

      <nav className="flex py-1 font-bold uppercase sm:justify-around ">
        <ul className="flex flex-wrap justify-center flex-grow-0 gap-3 mx-auto text-lg font-bold">
          <li>
            <Link className="mx-auto link link-hover link-primary" href={"/"}>
              {context?.locale == "en" ? "Home" : "Accueil"}
            </Link>
          </li>
          {headerData ? (
            headerData.map((headerLink) => {
              const translations = headerData.find((data) => data.slug == headerLink.slug)
                ?._translations._translations;
              const translatedHeaderLink =
                translations?.find(
                  (translation: { language: any }) => translation.language == context?.locale
                ) ?? null;

              return (
                <li key={headerLink?.slug}>
                  <Link
                    className="mx-auto link link-hover link-primary"
                    href={"/" + (translatedHeaderLink?.slug?.current ?? headerLink?.slug)}
                  >
                    {translatedHeaderLink?.title ?? headerLink?.title}
                  </Link>
                </li>
              );
            })
          ) : (
            <li>
              <Link className="mx-auto link link-hover link-primary" href={"/blog"}>
                Blog
              </Link>
            </li>
          )}
          {/*  <li><Link className='flex h-4 mx-auto link link-hover link-primary' href={contactUrl}>
                        <div className='w-4 mt-1 mr-1 '>{icon}</div>{contactText}</Link></li> */}
          <li>
            <ThemeSelector></ThemeSelector>
          </li>
        </ul>
      </nav>

      <div className="flex justify-center mx-auto mt-1 sm:mt-0"></div>
    </header>
  );
}
