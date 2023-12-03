import { PortableText } from "@portabletext/react";
import { myPortableTextComponents } from "@/components/myPortableTextComponents";
import { SanityDocument } from "next-sanity";

export default function Page({ page }: { page: SanityDocument }) {
  return (
    <div className="mx-auto font-sans text-center text-base-content">
      <div
        className="max-w-5xl px-4 mx-auto prose text-left lg:prose-xl prose-headings:text-center"
        key={page?.slug}
      >
        <PortableText value={page?.content} components={myPortableTextComponents as any} />
      </div>
    </div>
  );
}
