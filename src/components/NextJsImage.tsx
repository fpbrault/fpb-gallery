
import Image from "next/image";
import {
    isImageFitCover,
    isImageSlide,
    useLightboxProps,
} from "yet-another-react-lightbox";

import type { RenderPhotoProps } from "react-photo-album";
import { CustomImage } from "@/typings/images";

interface CustomRenderPhotoProps extends RenderPhotoProps {
    photo: any;
    limitHeight: boolean;
}


export function NextJsImageAlbum({
    limitHeight,
    photo,
    imageProps: { alt, title, sizes, className, onClick },
    wrapperStyle,
}: CustomRenderPhotoProps) {
    return (
        <div className={"rounded" + (limitHeight ? " max-h-[600px] " : "") + " cover group"} style={{ ...wrapperStyle, position: "relative" }}>
            <div className="absolute bottom-0 left-0 right-0 z-50 flex transition duration-300 ">
                <span className="px-3 mx-auto mb-5 transition duration-300 rounded shadow bg-primary drop-shadow-xl backdrop-blur group-hover:bg-black">
                <span className="z-50 px-2 text-3xl text-center text-black uppercase align-middle transition duration-300 drop-shadow group-hover:text-primary ">{photo.title}</span></span>
                </div>
            <Image
            fill
            draggable={false}
                className="object-contain transition-all duration-300 rounded border-primary group-hover:brightness-90 group-hover:border-4"
                src={photo.src}
                loading="eager"
                blurDataURL={photo.blurDataURL}
                placeholder={"blur"}
                sizes={sizes}
                {...{ alt, title, onClick }}
                unoptimized
            />
        
        </div>
    );
}

export function NextJsImageElement({
    limitHeight,
    photo,
    imageProps: { alt, title, sizes, className, onClick },
    wrapperStyle,
}: CustomRenderPhotoProps) {

    return (
        <div  className={"rounded" + (limitHeight ? " max-h-[800px] " : "") + " cover group"} style={{ ...wrapperStyle, position: "relative" }}>
   
            <Image
            fill
            draggable={false}
            className="object-contain rounded"
                src={photo.thumbnailSrc ?? ""}
                loading="eager"
                blurDataURL={photo?.placeholders?.metadata.lqip}
                placeholder={"blur"}
                sizes={sizes}
                {...{ alt, onClick }}
                unoptimized
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
                fill
                alt={slide.alt ?? ""}
                title={slide.alt}
                src={slide.src}
                loading="eager"
                blurDataURL={slide?.placeholders?.metadata.lqip}
                draggable={false}
                placeholder={"blur" }
                unoptimized
                style={{ objectFit: cover ? "cover" : "contain" }}
                sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
                
            />

        </div>
    );
}
