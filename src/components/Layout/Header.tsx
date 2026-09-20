"use client";

import React from "react";
import Link from "next/link";
import ThemeSelector from "./ThemeSelector";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FaBars } from "react-icons/fa6";
import { localizePath } from "@/i18n/config";
import { useLocale } from "../context/LocaleContext";
import type { HeaderData, NavigationItem } from "@/features/site/models";

type Props = {
  title: string;
  headerData: HeaderData;
};

function setDrawerOpen(open: boolean) {
  const drawerToggle = document.getElementById("my-drawer-3");
  if (drawerToggle instanceof HTMLInputElement) {
    drawerToggle.checked = open;
  }
}

export default function Header({ title, headerData }: Props) {
  const { locale } = useLocale();
  return (
    <header className="sticky top-0 z-40 flex flex-col w-full px-4 py-1 mx-auto rounded mx-a md:pt-4 bg-base-200/70 backdrop-blur-lg ">
      <h1 className="sr-only justify-center py-1 text-2xl font-light text-center font-display md:not-sr-only md:flex md:text-4xl lg:text-5xl">
        <Link className="link link-hover" href={localizePath("/", locale)}>
          {title}
        </Link>
      </h1>

      <nav aria-label="Primary navigation" className="font-bold uppercase navbar sm:justify-around">
        <div className="w-full navbar-start md:hidden">
          <button
            type="button"
            aria-label="open sidebar"
            onClick={() => setDrawerOpen(true)}
            className="text-3xl btn btn-square md:hidden btn-ghost"
          >
            <FaBars />
          </button>
          <Link
            className="w-full text-xl font-light text-center sm:text-2xl md:text-3xl link link-hover line-clamp-3 font-display"
            href={localizePath("/", locale)}
          >
            {title}
          </Link>
        </div>
        <div className="justify-center hidden w-full navbar-center md:flex">
          <ul className="flex gap-8 px-1 py-0 text-2xl font-bold font-display">
            {headerData?.showHome != false && (
              <li>
                <Link
                  className="mx-auto link link-hover link-primary"
                  href={localizePath("/", locale)}
                >
                  {locale === "en" ? "Home" : "Accueil"}
                </Link>
              </li>
            )}
            {headerData.pages.length ? (
              headerData.pages.map((headerLink) => {
                return <CustomHeaderLink key={headerLink.slug} item={headerLink} />;
              })
            ) : (
              <li>
                <Link
                  className="mx-auto link link-hover link-primary"
                  href={localizePath("/blog", locale)}
                >
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

export function HeaderSideBar({ headerData }: { headerData: HeaderData }) {
  const { locale } = useLocale();
  return (
    <aside aria-label="Mobile navigation" className="z-50 h-screen drawer-side md:hidden">
      <button
        type="button"
        aria-label="close sidebar"
        onClick={() => setDrawerOpen(false)}
        className="drawer-overlay !bg-transparent border-0 p-0"
      ></button>
      <div className="min-h-full font-black text-left uppercase font-display w-60 menu bg-base-100/80 backdrop-blur-xl">
        <ul className="p-4 text-3xl ">
          {/* Sidebar content here */}
          {headerData?.showHome != false && (
            <li>
              <Link
                className="mx-auto link link-hover link-primary"
                href={localizePath("/", locale)}
              >
                {locale === "en" ? "Home" : "Accueil"}
              </Link>
            </li>
          )}
          {headerData.pages.length ? (
            headerData.pages.map((headerLink) => {
              return <CustomHeaderLink key={headerLink.slug} item={headerLink} />;
            })
          ) : (
            <li>
              <Link
                className="mx-auto link link-hover link-primary"
                href={localizePath("/blog", locale)}
              >
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
    </aside>
  );
}

function CustomHeaderLink({ item }: { item: NavigationItem }) {
  const { locale } = useLocale();
  return (
    <li>
      <Link className="link link-hover link-primary" href={localizePath(`/${item.slug}`, locale)}>
        {item.title}
      </Link>
    </li>
  );
}
