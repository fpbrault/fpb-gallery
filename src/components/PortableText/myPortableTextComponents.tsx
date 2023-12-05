import React from "react";
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
    }
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
