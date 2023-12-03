import { faEarth } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React from "react";

export function LanguageSwitcher(props: any) {
  const router = useRouter();

  return (
    <button
      className="flex flex-row justify-end gap-1 text-lg font-bold no-underline uppercase rounded-full link hover:text-accent"
      onClick={() => {
        router.push(
          props.context?.otherLocale?.slug?.current ?? router.asPath,
          props.context?.otherLocale?.slug?.current ?? router.asPath,
          {
            locale: props.context?.locales?.find((locale: string) => locale != props.context.locale)
          }
        );
      }}
    >
      <span className="w-6 h-6 mt-0.5">
        <FontAwesomeIcon icon={faEarth}></FontAwesomeIcon>{" "}
      </span>
      {props.context?.locales?.find((locale: string) => locale != props.context?.locale)}
    </button>
  );
}
