"use client";

import { RichText } from "@/components/PortableText/RichText";
import ImageContext from "./PortableText/ImageContext";
import type { CustomPage } from "@/features/pages/models";

export default function Page({ page }: { page: CustomPage }) {
  const imageUrls: string[] = [];

  return (
    <ImageContext.Provider value={imageUrls}>
      <div className="mx-auto font-sans text-center text-base-content">
        <div
          className="max-w-5xl px-4 mx-auto prose text-left lg:prose-xl prose-headings:text-center"
          key={page.slug}
        >
          <RichText value={page.content} />
        </div>
      </div>
    </ImageContext.Provider>
  );
}
