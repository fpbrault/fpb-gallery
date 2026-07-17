"use client";

import { useMemo } from "react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import PhotoAlbum, { type ClickHandler } from "react-photo-album";
import { GalleryCaption } from "@/components/Albums/GalleryCaption";
import { GalleryThumbnailImage } from "@/components/Albums/GalleryThumbnailImage";
import { LightboxSlideImage } from "@/components/Albums/LightboxSlideImage";
import { useGalleryUrlState } from "@/components/Albums/useGalleryUrlState";
import { useIsMobile } from "@/components/Albums/useIsMobile";
import type { ContentImage } from "@/features/content/models";
import { mapGalleryImages } from "@/features/gallery/galleryMapper";
import type { GalleryThumbnail } from "@/features/gallery/models";

type Props = {
  images: ContentImage[];
  mode: "rows" | "columns" | "masonry";
  columns: number | undefined;
  dataSanity?: string;
};

function PhotoGallery({ images, mode, columns, dataSanity }: Props) {
  const { slides, thumbnails } = useMemo(() => mapGalleryImages(images), [images]);
  const lightboxSlides = useMemo(
    () =>
      slides.map((slide) => ({
        ...slide,
        description: slide.description?.length ? (
          <GalleryCaption value={slide.description} />
        ) : undefined
      })),
    [slides]
  );
  const isMobile = useIsMobile();
  const galleryUrl = useGalleryUrlState(slides.map(({ id }) => id));

  const handleImageClick: ClickHandler<GalleryThumbnail> = ({ index }) => {
    const selectedImageId = slides[index]?.id;
    if (selectedImageId) galleryUrl.open(selectedImageId);
  };

  if (!thumbnails.length) return null;

  return (
    <>
      <div data-sanity={dataSanity} data-sanity-edit-target="">
        <PhotoAlbum
          layout={mode ?? "rows"}
          photos={thumbnails}
          targetRowHeight={500}
          spacing={20}
          columns={columns ?? 3}
          render={{
            photo: (renderProps, context) => (
              <GalleryThumbnailImage
                context={context}
                key={context.photo.key}
                limitHeight={thumbnails.length < 3}
                renderProps={renderProps}
              />
            )
          }}
          sizes={{
            size: "calc(100vw - 240px)",
            sizes: [{ viewport: "(max-width: 960px)", size: "100vw" }]
          }}
          onClick={handleImageClick}
        />
      </div>

      <Lightbox
        index={galleryUrl.index}
        slides={lightboxSlides}
        plugins={[Fullscreen, Captions, Zoom, Counter, ({ remove }) => remove("no-scroll")]}
        captions={{ showToggle: true, descriptionTextAlign: "start", descriptionMaxLines: 50 }}
        styles={{
          captionsDescription: { backgroundColor: "rgba(0,0,0,0" },
          captionsTitle: { backgroundColor: "rgba(0,0,0,0" }
        }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonZoom: isMobile ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
          slide: LightboxSlideImage
        }}
        open={galleryUrl.index > -1}
        close={galleryUrl.close}
        on={{
          view: ({ index }) => {
            const selectedImageId = slides[index]?.id;
            if (selectedImageId) galleryUrl.view(selectedImageId);
          }
        }}
      />
    </>
  );
}

export default PhotoGallery;
