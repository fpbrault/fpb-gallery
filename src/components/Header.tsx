import React from "react";
import Link from "next/link";
import ThemeSelector from "./ThemeSelector";
import { getSocialIcon } from "./lib/getSocialIcon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FaBars } from "react-icons/fa6";

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
    <header className="sticky top-0 z-50 flex flex-col w-full px-4 py-1 mx-auto rounded mx-a lg:py-4 bg-base-200/70 backdrop-blur-lg">
      <h1 className="justify-center hidden py-1 font-sans text-2xl font-light text-center lg:flex sm:text-4xl lg:text-5xl">
        <Link className="link link-hover" href="/">
          {title}
        </Link>
      </h1>

      <nav className="font-bold uppercase navbar sm:justify-around">
        <div className="w-full navbar-start lg:hidden">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="text-3xl btn btn-square lg:hidden btn-ghost">
             <FaBars/>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-xl w-48">
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
                <div className="flex justify-center "> <LanguageSwitcher context={context}></LanguageSwitcher>
           
                  </div>
                  </li>
                  <li>
                <div className="flex justify-center "> 
                  <ThemeSelector></ThemeSelector>
                  </div>
                  </li>
            </ul>

          </div>
          <Link className="w-full font-sans text-xl font-light text-center sm:text-2xl md:text-3xl link link-hover" href="/">
            {title}
          </Link>
        </div>
        <div className="justify-center hidden w-full navbar-center lg:flex">
          <ul className="px-1 py-0 text-2xl font-bold menu menu-horizontal">
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
            {/*  <li><Link className='flex mx-auto link link-hover link-primary' href={contactUrl}>
                        <div className='w-4 mt-1 mr-1 '>{icon}</div>{contactText}</Link></li> */}

          </ul>
        </div>
        <div className="hidden lg:flex navbar-end">
        </div>
      </nav>

      <div className="flex justify-center mx-auto mt-1 sm:mt-0"></div>
    </header>
  );
}
