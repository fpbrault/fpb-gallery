import React from "react";

export function PTExternalLink(value: any, children: any) {
  const { blank, href } = value;
  return blank ? (
    <a className="link link-secondary" href={href} target="_blank" rel="noopener">
      {children}
    </a>
  ) : (
    <a className="link link-secondary" target="_blank" href={href}>
      {children}
    </a>
  );
}
