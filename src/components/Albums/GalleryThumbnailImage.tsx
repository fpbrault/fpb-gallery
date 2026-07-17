"use client";

import Image from "next/image";
import type { RenderPhotoContext, RenderPhotoProps } from "react-photo-album";

import type { GalleryThumbnail } from "@/features/gallery/models";

export function GalleryThumbnailImage({
  context: { height, photo, width },
  limitHeight,
  renderProps: { onClick }
}: {
  context: RenderPhotoContext<GalleryThumbnail>;
  limitHeight?: boolean;
  renderProps: RenderPhotoProps;
}) {
  return (
    <div
      data-sanity-edit-target=""
      className={`cover group rounded${limitHeight ? " max-h-200" : ""}`}
      style={{ height, position: "relative", width }}
    >
      <Image
        alt={photo.alt}
        blurDataURL={photo.lqip}
        className="rounded object-contain"
        draggable={false}
        height={photo.height}
        loading="lazy"
        onClick={onClick}
        placeholder={photo.lqip ? "blur" : "empty"}
        sizes={`${Math.ceil(width)}px`}
        src={photo.src}
        width={photo.width}
      />
    </div>
  );
}
