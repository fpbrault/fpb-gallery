import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import React from "react";
import { PortableText } from "@portabletext/react";
import { RoughNotation } from "react-rough-notation";

export const myPortableTextComponents = {
  marks: {
    internalLink: ({value, children}: {value: any, children: any}) => {
      const {slug = {}} = value;
      const prefix = value.type == 'album' ? '/album' : value.type == 'post' ? '/blog' : '';
      const href = prefix + `/${slug.current}`
      return <Link className="link link-primary" href={href}>{children}</Link>
    },
    link: ({value, children} : {value: any, children: any}) => {
      const { blank, href } = value
      return blank ?
        <a className="link link-secondary" href={href} target="_blank" rel="noopener">{children}</a>
        : <a className="link link-secondary" target="_blank" href={href}>{children}</a>
    },
    rough: (props: any) => {
      return (
        <RoughNotation
          animate={props?.value?.animate ?? null}
          multiline={true}
          color={props?.value?.color?.hex ?? null}
          type={props?.value?.type || "underline"}
          show={true}
        >
          {props.children}
          </RoughNotation>
      );
    }
  },
  block: {
    justify: ({ children }: { children: any }) => {
      return <div className="text-justify">{children}</div>;
    },
    center: ({ children }: { children: any }) => {
      return <div className="text-center">{children}</div>;
    }
  },
  types: {
    image: ({ value }: any) => {
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
            src={src}
          />
        </div>
      );
    },
    "layout-col-2": ({ value }: any) => {
      return (
        <div className="flex flex-col text-justify sm:gap-4 lg:flex-row">
          <div className="w-full lg:w-5/12">
            <PortableText components={myPortableTextComponents as any} value={value.leftCol} />
          </div>
          <span className="hidden sm:my-2 lg:w-2/12 sm:flex divider divider-horizontal"></span>
          <div className="w-full lg:w-5/12">
            <PortableText components={myPortableTextComponents as any} value={value.rightCol} />
          </div>
        </div>
      );
    },
    album: ({ value }: any) => {
      const src = urlForImage(value.images).width(128).height(64).url();
      return (
        <div className="w-full max-w-sm mx-auto shadow-xl">
          <span className="text-sm">Related Album:</span>
          <Link className="link link-primary link-hover" href={"/album/" + value.albumId}>
            <div className="flex w-full max-w-sm mx-auto transition border justify-evenly rounded-xl bg-primary text-primary-content border-primary hover:bg-primary-content hover:text-primary">
              <span className="self-center flex-grow px-2 font-bold text-center ">
                {" "}
                {value.albumName}
              </span>
              <Image
                unoptimized
                style={{ margin: 0 }}
                className="w-32 h-16 m-0 rounded-xl"
                width={128}
                height={64}
                alt=""
                quality={75}
                src={src}
              />
            </div>
          </Link>
        </div>
      );
    },
    albumCard: ({ value }: any) => {
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
    },
    Post: ({ value }: any) => {
      const src = urlForImage(value.coverImage).width(128).height(64).url();
      return (
        <div className="w-full max-w-sm mx-auto shadow-xl">
          <span className="text-sm">Related Post:</span>
          <Link className="link link-primary link-hover" href={"/album/" + value.albumId}>
            <div className="flex justify-between w-full max-w-sm mx-auto transition border rounded-xl bg-primary text-primary-content border-primary hover:bg-primary-content hover:text-primary">
              <Image
                unoptimized
                style={{ margin: 0 }}
                className="w-32 h-16 m-0 rounded-xl"
                width={128}
                height={64}
                alt=""
                quality={75}
                src={src ?? ""}
              />{" "}
              <span className="self-center flex-grow px-2 text-base font-bold text-center max-h-12 line-clamp-2 ">
                {" "}
                {value.title[0]?.value?.slice(0, 100) ?? "Article"}
              </span>
            </div>
          </Link>
        </div>
      );
    }
  }
};
