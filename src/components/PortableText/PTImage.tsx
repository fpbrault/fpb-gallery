"use client";

import { useContext, useMemo, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { urlForImage } from "@/sanity/lib/image";
import ImageContext from "./ImageContext";
import type { ContentImage } from "@/features/content/models";

export function PTImage(value: ContentImage & { blurDataURL?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const imageUrls = useContext(ImageContext);
  const thumbnailSrc = urlForImage(value).width(1000).quality(75).format("webp").url();
  const lightboxSrc = urlForImage(value).width(2048).quality(80).format("webp").url();
  const slides = useMemo(
    () => Array.from(new Set([...imageUrls, lightboxSrc])).map((src) => ({ src })),
    [imageUrls, lightboxSrc]
  );
  const currentIndex = Math.max(
    0,
    slides.findIndex((slide) => slide.src === lightboxSrc)
  );

  return (
    <div>
      <button
        type="button"
        className="block rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        aria-label={value.alt ? `Open image: ${value.alt}` : "Open image"}
        onClick={() => setIsOpen(true)}
      >
        <Image
          width={1000}
          height={1000}
          className="transition-transform duration-500 rounded shadow-2xl object-fit hover:scale-105"
          alt={value.alt ?? ""}
          blurDataURL={value.blurDataURL}
          placeholder={value.blurDataURL ? "blur" : "empty"}
          src={thumbnailSrc}
        />
      </button>
      <Lightbox open={isOpen} close={() => setIsOpen(false)} index={currentIndex} slides={slides} />
    </div>
  );
}
