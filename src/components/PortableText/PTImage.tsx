"use client";

import { useContext, useMemo, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";

import ImageContext from "./ImageContext";
import {
  getPortableImageId,
  type PortableImageValue
} from "@/features/content/portableImageRegistry";

export type { PortableImageValue } from "@/features/content/portableImageRegistry";

export function PTImage({ value }: { value: PortableImageValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const registry = useContext(ImageContext);
  const id = getPortableImageId(value);
  const entry = registry?.images.find((image) => image.id === id);
  const slides = useMemo(
    () =>
      registry?.images.map(({ slide }) => ({
        alt: slide.alt,
        height: slide.height,
        id: slide.id,
        src: slide.src,
        width: slide.width
      })) ?? [],
    [registry]
  );
  const currentIndex = entry ? (registry?.images.indexOf(entry) ?? -1) : -1;

  if (!entry || currentIndex < 0) return null;

  return (
    <div data-sanity-edit-target="">
      <button
        type="button"
        className="block rounded focus-visible:outline focus-visible:outline-primary"
        aria-label={entry.slide.alt ? `Open image: ${entry.slide.alt}` : "Open image"}
        onClick={() => setIsOpen(true)}
      >
        <Image
          width={entry.thumbnail.width}
          height={entry.thumbnail.height}
          className="transition-transform duration-500 rounded shadow-2xl object-fit hover:scale-105"
          alt={entry.slide.alt}
          blurDataURL={entry.slide.lqip}
          placeholder={entry.slide.lqip ? "blur" : "empty"}
          src={entry.thumbnail.src}
        />
      </button>
      <Lightbox close={() => setIsOpen(false)} index={currentIndex} open={isOpen} slides={slides} />
    </div>
  );
}
