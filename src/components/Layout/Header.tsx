import React from "react";
import Link from "next/link";
import ThemeSelector from "./ThemeSelector";
import { getSocialIcon } from "../lib/getSocialIcon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FaBars } from "react-icons/fa6";

type HeaderLink = {
  title: string;
  title_fr: string;
  slug: string;
  slug_fr: string;
  _translations: any;
};

type Props = {
  title: string;
  contactUrl: string;
  contactText: string;
  contactType: string;
  headerData: { showHome: Boolean; pages: Array<HeaderLink> };
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
  //const icon = getSocialIcon(contactType);
  return (
    <header className="sticky top-0 z-40 flex flex-col w-full px-4 py-1 mx-auto rounded mx-a md:pt-4 bg-base-200/70 backdrop-blur-lg ">
      <h1 className="justify-center hidden py-1 text-2xl font-light text-center font-display md:flex md:text-4xl lg:text-5xl ">
        <Link className="link link-hover" href="/">
          {title}
        </Link>
      </h1>

      <nav className="font-bold uppercase navbar sm:justify-around">
        <div className="w-full navbar-start md:hidden">
          <label
            htmlFor="my-drawer-3"
            aria-label="open sidebar"
            className="text-3xl btn btn-square md:hidden btn-ghost">
            <FaBars />
          </label>
          <Link
            className="w-full text-xl font-light text-center sm:text-2xl md:text-3xl link link-hover line-clamp-3 font-display"
            href="/">
            {title}
          </Link>
        </div>
        <div className="justify-center hidden w-full navbar-center md:flex">
          <ul className="flex gap-8 px-1 py-0 text-2xl font-bold font-display">
            {headerData?.showHome != false && (
              <li>
                <Link className="mx-auto link link-hover link-primary" href={"/"}>
                  {context?.locale == "en" ? "Home" : "Accueil"}
                </Link>
              </li>
            )}
            {headerData?.pages ? (
              headerData?.pages.map((headerLink) => {
                return CustomHeaderLink(headerData, headerLink, context);
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
        <div className="hidden md:flex navbar-end"></div>
      </nav>

      <div className="flex justify-center mx-auto mt-1 sm:mt-0"></div>
    </header>
  );
}

export function HeaderSideBar({
  headerData,
  context
}: {
  headerData: { showHome: Boolean; pages: Array<HeaderLink> };
  context: any;
}) {
  //const icon = getSocialIcon(contactType);
  return (
    <div className="z-50 h-screen drawer-side md:hidden">
      <label
        htmlFor="my-drawer-3"
        aria-label="close sidebar"
        className="drawer-overlay !bg-transparent"></label>
      <div className="min-h-full font-black text-left uppercase font-display w-60 menu bg-base-100/80 backdrop-blur-xl">
        <ul className="p-4 text-3xl ">
          {/* Sidebar content here */}
          {headerData?.showHome != false && (
            <li>
              <Link className="mx-auto link link-hover link-primary" href={"/"}>
                {context?.locale == "en" ? "Home" : "Accueil"}
              </Link>
            </li>
          )}
          {headerData?.pages ? (
            headerData?.pages.map((headerLink) => {
              return CustomHeaderLink(headerData, headerLink, context);
            })
          ) : (
            <li>
              <Link className="mx-auto link link-hover link-primary" href={"/blog"}>
                Blog
              </Link>
            </li>
          )}
        </ul>
        <div>
          <div className="my-1 divider"></div>
          <div className="flex justify-center gap-2">
            <div className="flex justify-center ">
              <LanguageSwitcher></LanguageSwitcher>
            </div>

            <div className="flex justify-center ">
              <ThemeSelector></ThemeSelector>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomHeaderLink(headerData: any, headerLink: HeaderLink, context: any) {
  const translations = headerData.pages.find(
    (data: { slug: string }) => data.slug == headerLink.slug
  )?._translations._translations;
  const translatedHeaderLink =
    translations?.find(
      (translation: { language: any }) => translation.language == context?.locale
    ) ?? null;

  const translatedHeaderText =
    (context?.locale == "fr" ? headerLink.title_fr : headerLink.title) ?? null;
  return (
    <li key={headerLink?.slug}>
      <Link
        className="link link-hover link-primary"
        href={"/" + (translatedHeaderLink?.slug?.current ?? headerLink?.slug)}>
        {translatedHeaderLink?.title ??
          translatedHeaderText ??
          headerLink?.title ??
          headerLink.slug}
      </Link>
    </li>
  );
}
