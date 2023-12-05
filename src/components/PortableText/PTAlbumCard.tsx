import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import React from "react";

export function PTAlbumCard(value: any) {
  const height = 300;
  const width = 200;
  try {
    const src = urlForImage(value.images).width(width).height(height).url();
    return (
      <div
        style={{ height: height, width: width }}
        className="relative mx-auto rounded cover group"
      >
        <Link href={value.albumId}>
          <div className="absolute bottom-0 left-0 right-0 z-20 flex transition duration-300 ">
            <div className="max-w-full px-3 mx-auto mb-5 transition duration-300 rounded shadow bg-primary drop-shadow-xl backdrop-blur group-hover:bg-base-100">
              <div className="z-20 px-2 text-3xl text-center uppercase truncate align-middle transition duration-300 sm:text-xl md:text-2xl lg:text-3xl text-primary-content drop-shadow group-hover:text-primary">
                {value.albumName}
              </div>
            </div>
          </div>
          <Image
            width={width}
            height={height}
            draggable={false}
            className="transition-all duration-300 rounded border-primary group-hover:brightness-90 group-hover:border-4"
            src={src}
            loading="eager"
            //blurDataURL={photo.blurDataURL}
            //placeholder={"blur"}
            //sizes={sizes}
            unoptimized
            alt={value.albumName}
            //{...{ alt, title, onClick }}
          />
        </Link>
      </div>
    );
  } catch (error: any) {
    return error?.message ?? error;
  }
}
