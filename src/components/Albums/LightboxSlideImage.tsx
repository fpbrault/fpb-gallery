"use client";

import Image from "next/image";
import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  type RenderSlideProps
} from "yet-another-react-lightbox";

import type { LightboxSlideModel } from "@/features/gallery/models";

export function LightboxSlideImage({ rect, slide }: RenderSlideProps) {
  const { imageFit } = useLightboxProps().carousel;
  if (!isLightboxSlide(slide)) return null;

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);
  const width = cover
    ? rect.width
    : Math.round(Math.min(rect.width, (rect.height / slide.height) * slide.width));
  const height = cover
    ? rect.height
    : Math.round(Math.min(rect.height, (rect.width / slide.width) * slide.height));

  return (
    <div data-sanity-edit-target="" style={{ height, position: "relative", width }}>
      <Image
        fill
        alt={slide.alt}
        blurDataURL={slide.lqip}
        draggable={false}
        loading="lazy"
        placeholder={slide.lqip ? "blur" : "empty"}
        sizes={`${Math.ceil(width)}px`}
        src={slide.src}
        style={{ objectFit: cover ? "cover" : "contain" }}
        title={slide.title}
      />
    </div>
  );
}

function isLightboxSlide(value: unknown): value is LightboxSlideModel {
  if (!value || typeof value !== "object") return false;
  const slide = value as Partial<LightboxSlideModel>;
  return (
    typeof slide.src === "string" &&
    typeof slide.width === "number" &&
    typeof slide.height === "number" &&
    typeof slide.id === "string"
  );
}
