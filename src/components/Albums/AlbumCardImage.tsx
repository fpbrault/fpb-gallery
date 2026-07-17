"use client";

import Image from "next/image";
import Link from "next/link";
import type { RenderPhotoContext, RenderPhotoProps } from "react-photo-album";

import type { AlbumCardPhoto } from "@/features/gallery/models";

export function AlbumCardImage({
  context: { height, photo, width },
  limitHeight,
  renderProps: { onClick }
}: {
  context: RenderPhotoContext<AlbumCardPhoto>;
  limitHeight?: boolean;
  renderProps: RenderPhotoProps;
}) {
  const limitHeightStyle = limitHeight
    ? { maxHeight: photo.height, width: photo.width }
    : undefined;

  return (
    <div
      data-sanity-edit-target=""
      className={`cover group mx-auto rounded${limitHeight ? " max-h-150" : ""}`}
      style={{ height, position: "relative", width, ...limitHeightStyle }}
    >
      <Link className="relative block h-full w-full" href={photo.href}>
        <div className="absolute right-0 bottom-0 left-0 z-20 mx-2 flex transition duration-300">
          <div className="bg-primary group-hover:bg-base-100 mx-auto mb-5 max-w-full rounded px-3 shadow backdrop-blur transition duration-300 drop-shadow-xl">
            <div className="text-primary-content group-hover:text-primary z-20 truncate px-2 align-middle font-display text-sm uppercase transition duration-300 drop-shadow sm:text-xl md:text-2xl">
              {photo.title}
            </div>
          </div>
        </div>
        <Image
          fill
          alt={photo.alt ?? ""}
          blurDataURL={photo.blurDataURL}
          className="border-primary rounded object-contain transition-all duration-300 group-hover:border-4 group-hover:brightness-90"
          draggable={false}
          loading="lazy"
          onClick={onClick}
          placeholder={photo.blurDataURL ? "blur" : "empty"}
          sizes={`${Math.ceil(width)}px`}
          src={photo.src}
          title={photo.title}
        />
      </Link>
    </div>
  );
}
