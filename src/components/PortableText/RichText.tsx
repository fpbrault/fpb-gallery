"use client";

import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import { myPortableTextComponents } from "@/components/PortableText/myPortableTextComponents";

export function RichText({ value }: { value?: unknown[] }) {
  if (!value?.length) return null;
  return (
    <PortableText value={value as PortableTextBlock[]} components={myPortableTextComponents} />
  );
}
