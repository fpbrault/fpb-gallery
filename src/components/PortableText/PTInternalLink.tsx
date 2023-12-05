import Link from "next/link";
import React from "react";

export function PTInternalLink(value: any, children: any) {
  const { slug = {} } = value;
  const prefix = value.type == "album" ? "/album" : value.type == "post" ? "/blog" : "";
  const href = prefix + `/${slug.current}`;
  return (
    <Link className="link link-primary" href={href}>
      {children}
    </Link>
  );
}
