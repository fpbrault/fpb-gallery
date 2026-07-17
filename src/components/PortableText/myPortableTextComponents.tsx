"use client";

import React, { useEffect, type ReactNode } from "react";
import type { PortableTextComponents } from "@portabletext/react";
import { PTYoutube } from "./PTYoutube";
import { PTRelatedPost, type RelatedPostValue } from "./PTRelatedPost";
import { PTRelatedAlbum, type RelatedAlbumValue } from "./PTRelatedAlbum";
import { PTLayoutCol, type LayoutColumnValue } from "./PTLayoutCol";
import { PTImage, type PortableImageValue } from "./PTImage";
import { PTInternalLink, type InternalLinkValue } from "./PTInternalLink";
import { PTRoughNotation } from "./PTRoughNotation";
import { PTExternalLink, type ExternalLinkValue } from "./PTExternalLink";
import { PTAlbumCard, type AlbumCardValue } from "./PTAlbumCard";
import type { Youtube } from "@/sanity/sanity.types";

export const myPortableTextComponents: PortableTextComponents = {
  marks: {
    internalLink: ({ value, children }) => (
      <PTInternalLink value={value as InternalLinkValue}>{children}</PTInternalLink>
    ),
    link: ({ value, children }) => (
      <PTExternalLink value={value as ExternalLinkValue}>{children}</PTExternalLink>
    ),
    rough: ({ children }) => <PTRoughNotation>{children}</PTRoughNotation>
  },
  block: {
    justify: ({ children }) => <div className="text-justify">{children}</div>,
    center: ({ children }) => <div className="text-center">{children}</div>,
    h1: ({ children }) => <PortableHeading level={1}>{children}</PortableHeading>,
    h2: ({ children }) => <PortableHeading level={2}>{children}</PortableHeading>
  },
  types: {
    youtube: ({ value }) => <PTYoutube value={value as Youtube} />,
    image: ({ value }) => <PTImage value={value as PortableImageValue} />,
    "layout-col-2": ({ value }) => <PTLayoutCol value={value as LayoutColumnValue} />,
    album: ({ value }) => <PTRelatedAlbum value={value as RelatedAlbumValue} />,
    albumCard: ({ value }) => <PTAlbumCard value={value as AlbumCardValue} />,
    Post: ({ value }) => <PTRelatedPost value={value as RelatedPostValue} />
  }
};

function PortableHeading({ children, level }: { children: ReactNode; level: 1 | 2 }) {
  const text = React.Children.toArray(children).join("");
  const id = text.replace(/\s+/g, "-").toLowerCase();

  useEffect(() => {
    const element = document.getElementById(id);
    if (element && window.location.hash === `#${id}`) scrollToElement(element, id);
  }, [id]);

  const content = (
    <a className="link link-hover" href={`#${id}`}>
      {children}
    </a>
  );
  return level === 1 ? (
    <h1 className="font-display" id={id}>
      {content}
    </h1>
  ) : (
    <h2 className="font-display" id={id}>
      {content}
    </h2>
  );
}
function scrollToElement(element: HTMLElement, id: string) {
  if (element) {
    window.scrollTo({
      top: element?.offsetTop - 150,
      behavior: "instant"
    });
    window.history.pushState(null, "", `#${id}`);
  }
}
