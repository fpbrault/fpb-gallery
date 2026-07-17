import { RichText } from "@/components/PortableText/RichText";
import type { ImageDescription } from "@/features/content/models";

export function GalleryCaption({ value }: { value: ImageDescription }) {
  if (!value.length) return null;
  return (
    <div className="bg-base-100/80 max-h-37.5 overflow-auto rounded px-2 py-0.5 backdrop-blur-xl prose prose-sm prose-red lg:prose-lg">
      <RichText value={value} />
    </div>
  );
}
