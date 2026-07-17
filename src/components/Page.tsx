import { RichText } from "@/components/PortableText/RichText";
import type { CustomPage } from "@/features/pages/models";

export default function Page({ page }: { page: CustomPage }) {
  return (
    <div className="mx-auto font-sans text-center text-base-content">
      <div
        className="max-w-5xl px-4 mx-auto prose text-left lg:prose-xl prose-headings:text-center"
        key={page.slug}
      >
        <RichText value={page.content} />
      </div>
    </div>
  );
}
