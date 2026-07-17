"use client";

import React, { useEffect, type ReactNode } from "react";
import { PTYoutube } from "./PTYoutube";
import { PTRelatedPost } from "./PTRelatedPost";
import { PTRelatedAlbum } from "./PTRelatedAlbum";
import { PTLayoutCol } from "./PTLayoutCol";
import { PTImage } from "./PTImage";
import { PTInternalLink } from "./PTInternalLink";
import { PTRoughNotation } from "./PTRoughNotation";
import { PTExternalLink } from "./PTExternalLink";
import { PTAlbumCard } from "./PTAlbumCard";

export const myPortableTextComponents = {
  marks: {
    internalLink: ({ value, children }: { value: any; children: any }) => {
      return PTInternalLink(value, children);
    },
    link: ({ value, children }: { value: any; children: any }) => {
      return PTExternalLink(value, children);
    },
    rough: (props: any) => {
      return PTRoughNotation(props);
    }
  },
  block: {
    justify: ({ children }: { children: any }) => {
      return <div className="text-justify">{children}</div>;
    },
    center: ({ children }: { children: any }) => {
      return <div className="text-center">{children}</div>;
    },
    h1: ({ children }: { children: ReactNode }) => (
      <PortableHeading level={1}>{children}</PortableHeading>
    ),
    h2: ({ children }: { children: ReactNode }) => (
      <PortableHeading level={2}>{children}</PortableHeading>
    )
  },
  types: {
    youtube: ({ value }: { value: any }) => {
      return PTYoutube(value);
    },
    image: ({ value }: any) => {
      return PTImage(value);
    },
    "layout-col-2": ({ value }: any) => {
      return PTLayoutCol(value);
    },
    album: ({ value }: any) => {
      return PTRelatedAlbum(value);
    },
    albumCard: ({ value }: any) => {
      return PTAlbumCard(value);
    },
    Post: ({ value }: any) => {
      return PTRelatedPost(value);
    }
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
function scrollToElement(element: HTMLElement | null, id: any) {
  if (element) {
    window.scrollTo({
      top: element?.offsetTop - 150,
      behavior: "instant"
    });
    window.history.pushState(null, "", `#${id}`);
  }
}
