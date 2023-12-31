import * as React from "react";

import Lightbox, { ControllerRef } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import { NextJsImage, NextJsImageElement } from "./NextJsImage";
import { useRouter } from "next/router";
import { getResizedImage } from "@/sanity/lib/image";
import PhotoAlbum, { ClickHandler, Photo } from "react-photo-album";
import { PortableText } from "@portabletext/react";
import { myPortableTextComponents } from "@/components/PortableText/myPortableTextComponents";
import { RoughNotationGroup } from "react-rough-notation";

type Props = {
  images: any[];
  mode: "rows" | "columns" | "masonry";
  slug: string;
  columns: number | undefined;
};

function PhotoGallery({ images, mode, slug, columns }: Props) {
  const router = useRouter();
  const imageId = router.query.imageId;
  const [index, setIndex] = React.useState(-1);
  const lightboxRef = React.useRef<ControllerRef | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  

  const [theImages, setTheImages] = React.useState<any[]>([]);

  React.useEffect(() => {
    // This function runs whenever `images` prop changes
    const newImages = images ? images.map((image) => {
      const { imageUrl, imageWidth, imageHeight } = getResizedImage(image, 80, 2048);
      return {
        ...image,
        src: imageUrl,
        height: imageHeight,
        width: imageWidth,
        title: (
          <>
            <div className="mt-6 text-3xl text-white bg-transparent text-bold text-sans">{image.title}</div>
          </>
        ),
        description: (
          <>
            {image.description && (
              <div className="max-h-[150px] overflow-auto px-2 py-0.5 prose-sm prose rounded prose-red bg-base-100/80 backdrop-blur-xl lg:prose-lg">
                <RoughNotationGroup>
                  <PortableText
                    components={myPortableTextComponents as any}
                    value={image.description}
                  />
                </RoughNotationGroup>
              </div>
            )}
          </>
        ),
      };
    }) : [];
    setTheImages(newImages);
  }, [images]);

  // Update the state on component mount
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    // Set initial mobile state
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleImageClick = ({ index: current }: { index: any }) => {
    setIndex(current);

    // Extract the image id from the src URL
    const selectedImageId = (theImages[current] as any)._key;

    // Update the URL with the selected image id in the query parameter
    router.push(`${slug}?imageId=${selectedImageId}`, undefined, { shallow: true });
  };

  React.useEffect(() => {
    if (imageId) {
      // Find the index of the image with the specified id
      const selectedIndex = theImages.findIndex((image) => image._key === imageId);
      // If the image is found, open the lightbox
      if (selectedIndex !== -1) {
        setIndex(selectedIndex);
      }
    } else if (lightboxRef.current && typeof imageId == "undefined") {
      setIndex(-1);
      lightboxRef.current.close();
    }
  }, [imageId, theImages, router]);

  if (!images) {
    return "nothing";
  }

  return (
    <>
      <PhotoAlbum
        layout={mode ?? "rows"}
        photos={theImages}
        targetRowHeight={500}
        spacing={20}
        columns={isMobile ? 1 : columns ?? 3}
        renderPhoto={(photo) =>
          NextJsImageElement({
            limitHeight: theImages.length < 3 ? true : false,
            ...photo,
            layoutOptions: {
              ...photo.layoutOptions,
              onClick: photo.layoutOptions.onClick as ClickHandler<Photo>
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
        styles={{ captionsDescription: { backgroundColor: "rgba(0,0,0,0" }, captionsTitle: { backgroundColor: "rgba(0,0,0,0" } }}
        render={{
          buttonPrev: theImages.length <= 1 ? () => null : undefined,
          buttonZoom: isMobile ? () => null : undefined,
          buttonNext: theImages.length <= 1 ? () => null : undefined,
          slide: NextJsImage
        }}
        open={index > -1}
        close={() => {
          setIndex(-1);

          // Check if the current URL contains the imageId parameter
          const currentUrl = window.location.href;
          if (currentUrl.includes("imageId")) {
            // Update the URL without the imageId parameter
            router.push("/album/" + slug, undefined, { shallow: true });
          }
        }}
        on={{
          view: ({ index: currentIndex }) => {
            // Extract the image id from the src URL

            // Update the code to access the _key property
            const selectedImageId = theImages[currentIndex]._key;
            // Update the URL with the selected image id in the query parameter
            router.replace(`${slug}?imageId=${selectedImageId}`, undefined, { shallow: true });
          }
        }}
      />
    </>
  );
}

export default PhotoGallery;
