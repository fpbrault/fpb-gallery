
import Image from "next/image";
import {
    isImageFitCover,
    isImageSlide,
    useLightboxProps,
} from "yet-another-react-lightbox";

import type { RenderPhotoProps } from "react-photo-album";
import { getResizedImage } from "@/sanity/lib/client";
import Link from "next/link";

interface CustomRenderPhotoProps extends RenderPhotoProps {
    photo: any;
    limitHeight?: boolean;
}


export function NextJsImageAlbum({
    limitHeight,
    photo,
    imageProps: { alt, title, sizes, className, onClick },
    wrapperStyle,
}: CustomRenderPhotoProps) {

    const limitHeightStyle = limitHeight ? {
        width: photo.width,
        height: photo.height,
    } : {}
    return (

        <div className={"mx-auto rounded" + (limitHeight ? " max-h-[600px] " : "") + " cover group"} style={{ ...wrapperStyle, ...limitHeightStyle, position: "relative" }}>
            <Link href={photo.href ?? '/'}>
                <div className="absolute bottom-0 left-0 right-0 z-20 flex transition duration-300 ">
                    <div className="max-w-full px-3 mx-auto mb-5 transition duration-300 rounded shadow bg-primary drop-shadow-xl backdrop-blur group-hover:bg-base-100">
                        <div className="z-20 px-2 text-3xl text-center uppercase truncate align-middle transition duration-300 sm:text-xl md:text-2xl lg:text-3xl text-primary-content drop-shadow group-hover:text-primary">{photo.title}</div></div>
                </div>
                <Image
                    fill draggable={false}
                    className="object-contain transition-all duration-300 rounded border-primary group-hover:brightness-90 group-hover:border-4"
                    src={photo.src}
                    loading="eager"
                    blurDataURL={photo.blurDataURL}
                    placeholder={"blur"}
                    sizes={sizes}
                    unoptimized
                    {...{ alt, title, onClick }}
                />
            </Link>
        </div>
    );
}

export function NextJsImageElement({
    limitHeight,
    photo,
    imageProps: { alt, title, sizes, className, onClick },
    wrapperStyle,
}: CustomRenderPhotoProps) {
    const { imageUrl: thumbnailUrl, imageWidth, imageHeight } = getResizedImage(photo, 80, 1000)

    return (
        <div className={"rounded" + (limitHeight ? " max-h-[800px] " : "") + " cover group"} style={{ ...wrapperStyle, position: "relative" }}>
            <Image
                unoptimized
                height={imageHeight}
                width={imageWidth}
                draggable={false}
                className="object-contain rounded"
                src={thumbnailUrl}
                loading="lazy"
                blurDataURL={photo?.placeholders?.metadata.lqip}
                placeholder={"blur"}
                sizes={sizes}
                {...{ alt, onClick }}
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
    alt?: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
    placeholders?: { metadata: { lqip: string } }
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
        )
        : rect.height;


    return (
        <div style={{ position: "relative", width, height }}>
            <Image
                unoptimized
                fill
                alt={slide.alt ?? ""}
                title={slide.alt}
                src={slide.src}
                loading="eager"
                blurDataURL={slide?.placeholders?.metadata.lqip}
                draggable={false}
                placeholder={"blur"}
                style={{ objectFit: cover ? "cover" : "contain" }}
                sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
            />

        </div>
    );
}
