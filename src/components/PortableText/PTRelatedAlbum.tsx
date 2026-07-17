"use client";

import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import React from "react";
import { useLocale } from "@/components/context/LocaleContext";
import { localizePath } from "@/i18n/config";
import type { Image as SanityImage } from "sanity";

export type RelatedAlbumValue = {
  albumName?: string;
  images?: SanityImage;
  slug?: string;
};

export function PTRelatedAlbum({ value }: { value: RelatedAlbumValue }) {
  const { locale, t } = useLocale();
  if (!value.images?.asset || !value.slug) return null;
  const src = urlForImage(value.images).width(128).height(64).url();
  return (
    <div className="w-full max-w-sm mx-auto shadow-xl">
      <span className="text-sm">{t("related.album")}:</span>
      <Link
        className="link link-secondary link-hover"
        href={localizePath("/album/" + value.slug, locale)}
      >
        <div className="flex w-full max-w-sm mx-auto transition-all border justify-evenly rounded-xl bg-secondary text-secondary-content border-secondary hover:bg-secondary-content hover:text-secondary">
          <span className="self-center flex-grow px-2 font-bold text-center ">
            {value.albumName ?? "Album"}
          </span>
          <Image
            style={{ margin: 0 }}
            className="w-32 h-16 m-0 rounded-xl"
            width={128}
            height={64}
            alt=""
            quality={75}
            src={src}
          />
        </div>
      </Link>
    </div>
  );
}
