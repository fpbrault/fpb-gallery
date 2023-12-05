import { useRouter } from "next/router";
import React from "react";
import { usePageProps } from "./lib/PagePropsContext";

export function LanguageSwitcher(props: any) {
  const router = useRouter();
  const pageProps = usePageProps();
  return (
    <button
      className="flex flex-row justify-end gap-2 text-lg font-bold no-underline uppercase rounded-full link hover:text-accent"
      onClick={() => {
        router.push(
          pageProps?.otherLocale?.slug?.current ?? router.asPath,
          pageProps?.otherLocale?.slug?.current ?? router.asPath,
          {
            locale: pageProps?.locales?.find((locale: string) => locale != pageProps.locale)
          }
        );
      }}
    >
      {/*    <span className="w-6 h-6 mt-0.5">
        <FontAwesomeIcon icon={faEarth}></FontAwesomeIcon>{" "}
      </span> */}
      {pageProps?.locales?.find((locale: string) => locale != pageProps?.locale)}
    </button>
  );
}
