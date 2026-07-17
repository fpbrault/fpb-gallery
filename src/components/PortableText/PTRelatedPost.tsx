"use client";

import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import React from "react";
import { useLocale } from "@/components/context/LocaleContext";
import { localizePath } from "@/i18n/config";
import type { Image as SanityImage } from "sanity";
import { stegaClean } from "next-sanity";

export type RelatedPostValue = {
  coverImage?: SanityImage;
  slug?: string;
  title?: Array<{ value?: string }>;
};

export function PTRelatedPost({ value }: { value: RelatedPostValue }) {
  const { locale, t } = useLocale();
  const slug = stegaClean(value.slug);
  if (!value.coverImage?.asset || !slug) return null;
  const src = urlForImage(value.coverImage).width(128).height(64).url();
  return (
    <div className="w-full max-w-sm mx-auto shadow-xl">
      <span className="text-sm">{t("related.post")}:</span>
      <Link className="link link-primary link-hover" href={localizePath("/blog/" + slug, locale)}>
        <div className="flex justify-between w-full max-w-sm mx-auto transition-all border rounded-xl bg-primary text-primary-content border-primary hover:bg-primary-content hover:text-primary">
          <Image
            style={{ margin: 0 }}
            className="w-32 h-16 m-0 rounded-xl"
            width={128}
            height={64}
            alt=""
            quality={75}
            src={src ?? ""}
          />{" "}
          <span className="self-center flex-grow px-2 text-base font-bold text-center max-h-12 line-clamp-2 ">
            {" "}
            {value.title?.[0]?.value ?? "Article"}
          </span>
        </div>
      </Link>
    </div>
  );
}
