"use client";

import { useContext, useMemo } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import ImageContext from "@/components/PortableText/ImageContext";
import { myPortableTextComponents } from "@/components/PortableText/myPortableTextComponents";
import { collectPortableImages } from "@/features/content/portableImageRegistry";

export function RichText({ value }: { value?: unknown[] }) {
  const parentRegistry = useContext(ImageContext);
  const images = useMemo(() => collectPortableImages(value), [value]);
  if (!value?.length) return null;

  const content = (
    <PortableText components={myPortableTextComponents} value={value as PortableTextBlock[]} />
  );
  if (parentRegistry) return content;
  return <ImageContext.Provider value={{ images }}>{content}</ImageContext.Provider>;
}
