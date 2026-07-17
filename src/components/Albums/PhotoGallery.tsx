"use client";

import * as React from "react";

import Lightbox, { ControllerRef } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import { NextJsImage, NextJsImageElement } from "./NextJsImage";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getResizedImage } from "@/sanity/lib/image";
import PhotoAlbum, { ClickHandler } from "react-photo-album";
import { PortableText } from "@portabletext/react";
import { myPortableTextComponents } from "@/components/PortableText/myPortableTextComponents";
import type { ContentImage } from "@/features/content/models";

const mobileQuery = "(max-width: 768px)";

function subscribeToMobile(callback: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}

type Props = {
  images: ContentImage[];
  mode: "rows" | "columns" | "masonry";
  columns: number | undefined;
};

function PhotoGallery({ images, mode, columns }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const imageId = searchParams?.get("imageId") ?? null;
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const lightboxRef = React.useRef<ControllerRef | null>(null);
  const isMobile = React.useSyncExternalStore(subscribeToMobile, getMobileSnapshot, () => false);

  const theImages = React.useMemo(
    () =>
      images
        ? images.map((image) => {
            const { imageUrl, imageWidth, imageHeight } = getResizedImage(image, 80, 2048);
            return {
              ...image,
              src: imageUrl,
              height: imageHeight,
              width: imageWidth,
              title: (
                <>
                  <div className="mt-6 text-3xl text-white bg-transparent text-bold text-sans">
                    {image.title}
                  </div>
                </>
              ),
              description: (
                <>
                  {image.description && (
                    <div className="max-h-[150px] overflow-auto px-2 py-0.5 prose-sm prose rounded prose-red bg-base-100/80 backdrop-blur-xl lg:prose-lg">
                      <PortableText
                        components={myPortableTextComponents as any}
                        value={image.description}
                      />
                    </div>
                  )}
                </>
              )
            };
          })
        : [],
    [images]
  );
  const deepLinkedIndex = imageId ? theImages.findIndex((image) => image._key === imageId) : -1;
  const index = imageId ? deepLinkedIndex : selectedIndex;

  const handleImageClick = ({ index: current }: { index: any }) => {
    setSelectedIndex(current);

    // Extract the image id from the src URL
    const selectedImageId = (theImages[current] as any)._key;

    // Update the URL with the selected image id in the query parameter
    router.push(`${pathname}?imageId=${selectedImageId}`, { scroll: false });
  };

  if (!images) {
    return "nothing";
  }

  return (
    <>
      <PhotoAlbum
        layout={mode ?? "rows"}
        photos={theImages as any}
        targetRowHeight={500}
        spacing={20}
        columns={columns ?? 3}
        renderPhoto={(photo: any) =>
          NextJsImageElement({
            limitHeight: theImages.length < 3 ? true : false,
            ...photo,
            layoutOptions: {
              ...photo.layoutOptions,
              onClick: photo.layoutOptions.onClick as ClickHandler
            }
          })
        }
        sizes={{
          size: "calc(100vw - 240px)",
          sizes: [{ viewport: "(max-width: 960px)", size: "100vw" }]
        }}
        onClick={handleImageClick}
      />

      <Lightbox
        controller={{ ref: lightboxRef }}
        index={index}
        slides={theImages}
        plugins={[Fullscreen, Captions, Zoom, Counter, ({ remove }) => remove("no-scroll")]}
        captions={{ showToggle: true, descriptionTextAlign: "start", descriptionMaxLines: 50 }}
        styles={{
          captionsDescription: { backgroundColor: "rgba(0,0,0,0" },
          captionsTitle: { backgroundColor: "rgba(0,0,0,0" }
        }}
        render={{
          buttonPrev: theImages.length <= 1 ? () => null : undefined,
          buttonZoom: isMobile ? () => null : undefined,
          buttonNext: theImages.length <= 1 ? () => null : undefined,
          slide: NextJsImage
        }}
        open={index > -1}
        close={() => {
          setSelectedIndex(-1);

          // Check if the current URL contains the imageId parameter
          if (searchParams?.has("imageId")) {
            router.push(pathname ?? "/", { scroll: false });
          }
        }}
        on={{
          view: ({ index: currentIndex }) => {
            // Extract the image id from the src URL

            // Update the code to access the _key property
            const selectedImageId = theImages[currentIndex]?._key;
            if (!selectedImageId) return;
            // Update the URL with the selected image id in the query parameter
            router.replace(`${pathname}?imageId=${selectedImageId}`, { scroll: false });
          }
        }}
      />
    </>
  );
}

export default PhotoGallery;
