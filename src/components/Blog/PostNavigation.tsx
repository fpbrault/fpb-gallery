import Link from "next/link";
import Image from "next/image";
import { getResizedImageSquare } from "@/sanity/lib/image";
import React from "react";
import { useTranslation } from "next-i18next";

function PostNavigationItem(props: any) {
  return (
    <div className="flex w-full nav-item indicator">
      {props.data?.slug && (
        <>
          <div className="indicator-item indicator-center badge-sm badge badge-primary backdrop-blur-xl">
            {props.label}
          </div>
          <Link
            className="w-full group-[&>:nth-of-type(even)]:ml-auto"
            href={"/blog/" + props.data.slug.current}
          >
            <div className="flex justify-start text-center group-[&>:nth-of-type(even)]:flex-row-reverse rounded-2xl w-full bg-base-300">
              <Image
                unoptimized
                className="w-1/3 max-w-[100px] shadow-md group-[&>:nth-of-type(even)]:rounded-r-2xl group-[&>:nth-of-type(odd)]:rounded-l-2xl"
                alt="Previous post"
                src={
                  props.relatedPostImage?.imageUrl ??
                  "https://placehold.co/200x200/jpg?text=" +
                    (props.data.title.length >= 60
                      ? props.data.title.substring(0, 60) + "..."
                      : props.data.title
                    ).replace(/ /g, "+")
                }
                height={props.relatedPostImage?.imageHeight ?? 200}
                width={props.relatedPostImage?.imageWidth ?? 200}
              ></Image>
              <span className="flex flex-col justify-center w-full px-2 text-sm font-bold">
                {props.data.title.length >= 60
                  ? props.data.title.substring(0, 60) + "..."
                  : props.data.title}
              </span>
            </div>
          </Link>
        </>
      )}
    </div>
  );
}

export function PostNavigation(props: any) {
  const { t } = useTranslation("common");
  const height = 100;
  const relatedPostImages = {
    previous: props.data.previous?.coverImage
      ? getResizedImageSquare(props.data.previous?.coverImage, height, 80)
      : null,
    next: props.data.next?.coverImage
      ? getResizedImageSquare(props.data.next?.coverImage, height, 80)
      : null
  };

  if (!props.data) {
    return null;
  }
  return (
    <nav className="flex-col w-full max-w-2xl px-4 mx-auto my-8 space-y-6 sm:flex group lg:max-w-3xl sm:flex-row">
      <span className="flex divider sm:hidden"></span>
      <PostNavigationItem
        data={props.data.previous}
        relatedPostImage={relatedPostImages.previous}
        label={"← " + t("blog.previousPost")}
      ></PostNavigationItem>
      <span className="hidden my-2 sm:w-2/12 sm:flex divider divider-horizontal"></span>
      <PostNavigationItem
        data={props.data.next}
        relatedPostImage={relatedPostImages.next}
        label={t("blog.nextPost") + " →"}
      ></PostNavigationItem>
      <span className="flex divider sm:hidden"></span>
    </nav>
  );
}
