import React from "react";
import { PortableText } from "@portabletext/react";
import { myPortableTextComponents } from "./myPortableTextComponents";

export function PTLayoutCol(value: any) {
  return <div className="flex flex-col text-justify sm:gap-4 lg:flex-row">
    <div className="w-full lg:w-5/12">
      <PortableText components={myPortableTextComponents as any} value={value.leftCol} />
    </div>
    <span className="hidden sm:my-2 lg:w-2/12 sm:flex divider divider-horizontal"></span>
    <div className="w-full lg:w-5/12">
      <PortableText components={myPortableTextComponents as any} value={value.rightCol} />
    </div>
  </div>;
}
