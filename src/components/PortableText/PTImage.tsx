import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import React from "react";

export function PTImage(value: any) {
  const src = urlForImage(value).url();
  return (
    <div className="">
      <Image
        width={500}
        height={500}
        className="rounded shadow-2xl object-fit "
        unoptimized
        alt=""
        quality={75}
        {...value}
        src={src} />
    </div>
  );
}
