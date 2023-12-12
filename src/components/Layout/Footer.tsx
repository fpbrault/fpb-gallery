import React from "react";
import Link from "next/link";
import { Layout } from "@/types/layout";
import { getSocialIcon } from "../lib/getSocialIcon";
import ThemeSelector from "../Layout/ThemeSelector";
import { LanguageSwitcher } from "../Layout/LanguageSwitcher";

export function Footer({ metadata, context }: { metadata: Layout.LayoutMetadata; context: any }) {
  return (
    <footer className="relative bottom-0 z-40 flex flex-col-reverse items-center justify-between gap-3 px-8 py-4 font-sans text-xs sm:flex-row sm:text-sm footer bg-neutral text-neutral-content">
      <aside className="flex items-center lg:w-5/12 ">
        <svg
          className="fill-neutral-content"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="M456-600h320q-27-69-82.5-118.5T566-788L456-600Zm-92 80 160-276q-11-2-22-3t-22-1q-66 0-123 25t-101 67l108 188ZM170-400h218L228-676q-32 41-50 90.5T160-480q0 21 2.5 40.5T170-400Zm224 228 108-188H184q27 69 82.5 118.5T394-172Zm86 12q66 0 123-25t101-67L596-440 436-164q11 2 21.5 3t22.5 1Zm252-124q32-41 50-90.5T800-480q0-21-2.5-40.5T790-560H572l160 276ZM480-480Zm0 400q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
        </svg>

        <span className="text-xs">
          {" "}
          Copyright © {new Date().getFullYear()} - {metadata.author}
        </span>
      </aside>
      <div className="justify-center hidden gap-4 md:flex sm:w-2/12">
        <LanguageSwitcher context={context}></LanguageSwitcher>
        <ThemeSelector></ThemeSelector>
      </div>

      <nav className="justify-end grid-flow-col gap-4 py-2 lg:w-5/12 md:place-self-center md:justify-self-end place-items-center">
        {metadata.socialLinks.length > 0 &&
          metadata.socialLinks.map((socialLink, index) => (
            <Link
              key={index}
              target="_blank"
              className="w-6 h-6 transition link hover:link-primary link-hover"
              href={socialLink.url}
            >
              {getSocialIcon(socialLink.type)}
            </Link>
          ))}
      </nav>
    </footer>
  );
}
