import React, { useState, useContext } from "react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import Lightbox from 'react-spring-lightbox';
import ImageContext from "./ImageContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
export function PTImage(value: any) {

  const [isOpen, setIsOpen] = useState(false);
  const imageUrls = useContext(ImageContext);
  const src = urlForImage(value).width(1000).quality(75).format('webp').url(); // Thumbnail image
  const lightboxSrc = urlForImage(value).width(2048).quality(80).format('webp').url(); // Lightbox image
  const [currentIndex, setCurrentIndex] = useState(imageUrls.indexOf(lightboxSrc));

  const gotoPrevious = () =>
    currentIndex > 0 && setCurrentIndex(currentIndex - 1);

  const gotoNext = () => {
    if (currentIndex + 1 < imageUrls.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!imageUrls.includes(lightboxSrc)) {
    imageUrls.push(lightboxSrc);
  }

  return (
    <div>
      <Image
        width={200}
        height={200}
        className="transition-transform duration-500 rounded shadow-2xl cursor-pointer object-fit hover:scale-105"
        unoptimized
        alt=""
        blurDataURL={value?.blurDataURL}
        placeholder={value?.blurDataURL ?? "empty"}
        {...value}
        src={src}
        onClick={() => {
          setCurrentIndex(imageUrls.indexOf(lightboxSrc));
          setIsOpen(true);
        }}
      />
      {isOpen && (
        <Lightbox
          currentIndex={currentIndex}
          images={imageUrls.map((url: any) => ({ src: url }))}
          isOpen={isOpen}
          className="bg-black"
          onClose={() => setIsOpen(false)}
          onPrev={gotoPrevious}
          onNext={gotoNext}
          renderPrevButton={({ canPrev }) => (
            <button
              type="button"
              onClick={gotoPrevious}
              disabled={!canPrev}
              className="absolute bottom-0 left-0 z-50 m-4 text-3xl text-white bg-gray-900 opacity-25 hover:opacity-100 btn-circle btn btn-ghost hover:bg-gray-400"
            >
              <FaArrowLeft />
            </button>
          )}
          renderNextButton={({ canNext }) => (
            <button
              type="button"
              onClick={gotoNext}
              disabled={!canNext}
              className="absolute bottom-0 right-0 z-50 m-4 text-3xl text-white bg-gray-900 opacity-25 hover:opacity-100 btn-circle btn btn-ghost hover:bg-gray-400"
            >
              <FaArrowRight />
            </button>
          )}
        />
      )}
    </div>
  );
}