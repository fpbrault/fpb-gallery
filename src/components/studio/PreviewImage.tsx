import createImageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import React, { useMemo } from "react";
import { useClient, type PreviewProps } from "sanity";

function getImageReference(media: PreviewProps["media"]): string | undefined {
  if (!media || typeof media !== "object" || !("_ref" in media)) return undefined;
  return typeof media._ref === "string" ? media._ref : undefined;
}

export function PreviewImage(props: PreviewProps) {
  const imageReference = getImageReference(props.media);
  const client = useClient({ apiVersion: "2021-03-25" });

  const imageUrlBuilder = useMemo(() => createImageUrlBuilder(client), [client]);

  const imgSrc = useMemo(
    () => imageReference && imageUrlBuilder.image(imageReference).width(500).url(),
    [imageReference, imageUrlBuilder]
  );

  if (!imgSrc) {
    return null;
  }

  const newProps = {
    ...props,
    media: <Image unoptimized src={imgSrc} alt="" width={500} height={300} />
  };

  return props.renderDefault(newProps);
}
