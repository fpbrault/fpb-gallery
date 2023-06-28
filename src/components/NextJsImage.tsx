'use client'
import Image from "next/image";
import {
    isImageFitCover,
    isImageSlide,
    useLightboxProps,
} from "yet-another-react-lightbox";

import type { RenderPhotoProps } from "react-photo-album";

export function NextJsImageAlbum({
    photo,
    imageProps: { alt, title, sizes, className, onClick },
    wrapperStyle,
}: RenderPhotoProps) {
    return (
        <div style={{ ...wrapperStyle, position: "relative" }}>
            <Image
                fill
                src={photo}
                placeholder={"blurDataURL" in photo ? "blur" : undefined}
                {...{ alt, title, sizes, className, onClick }}
            />
        </div>
    );
}

function isNextJsImage(slide: SlideImage) {
    return (
        isImageSlide(slide) &&
        typeof slide.width === "number" &&
        typeof slide.height === "number"
    );
}

type SlideImage = {
    src: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
};

type NextJsImageProps = {
    slide: SlideImage;
    rect: {
        width: number;
        height: number;
    };
};

export function NextJsImage({ slide, rect }: NextJsImageProps) {
    const { imageFit } = useLightboxProps().carousel;
    const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

    if (!isNextJsImage(slide)) return null;

    const width = !cover
        ? Math.round(
            Math.min(
                rect.width,
                (rect.height / (slide.height || 1)) * (slide.width || 1)
            )
        )
        : rect.width;

    const height = !cover
        ? Math.round(
            Math.min(
                rect.height,
                (rect.width / (slide.width || 1)) * (slide.height || 1)
            )
        ) - 50
        : rect.height - 50;
    return (
        <div style={{ position: "relative", width, height }}>
            {/* <div className='absolute bottom-[-35px] left-0 right-0 z-50 p-2 font-sans text-xs text-center text-whit'>Copyright {new Date().getFullYear()} Felix Perron-Brault. Tout Droits Reservés</div> */}
            <Image
                fill
                alt=""
                src={slide.src}
                loading="eager"
                draggable={false}
                placeholder={slide.blurDataURL ? "blur" : undefined}
                style={{ objectFit: cover ? "cover" : "contain" }}
                sizes={`${Math.ceil((width / window.innerWidth) * 50)}vw`}
                quality={100}
            />

        </div>
    );
}