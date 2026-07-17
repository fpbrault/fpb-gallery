import type { BlockContent } from "@/sanity/sanity.types";
import { RichText } from "@/components/PortableText/RichText";

export type LayoutColumnValue = Extract<BlockContent[number], { _type: "layout-col-2" }>;

export function PTLayoutCol({ value }: { value: LayoutColumnValue }) {
  return (
    <div className="flex flex-col text-justify sm:gap-4 lg:flex-row">
      <div className="w-full lg:w-5/12">
        <RichText value={value.leftCol} />
      </div>
      <span className="hidden sm:my-2 lg:w-2/12 sm:flex divider divider-horizontal"></span>
      <div className="w-full lg:w-5/12">
        <RichText value={value.rightCol} />
      </div>
    </div>
  );
}
