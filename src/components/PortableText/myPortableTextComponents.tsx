import React, { useEffect } from "react";
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
    h1: ({ children }: { children: any }) => {
      const handleClick = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const element = document.getElementById(id);
        scrollToElement(element, id);

      };
      const text = children.join('');
      const id = text.replace(/\s+/g, '-').toLowerCase();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        const element = document.getElementById(id);
        if (element && window.location.hash === `#${id}`) {
          scrollToElement(element, id);
        }
      }, [id]);

      return <h1 id={id} >
        <a className="link link-hover" onClick={handleClick} href={`#${id}`}>{children}</a>
      </h1>;
    },
    h2: ({ children }: { children: any }) => {
      const handleClick = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const element = document.getElementById(id);
        scrollToElement(element, id);

      };
      const text = children.join('');
      const id = text.replace(/\s+/g, '-').toLowerCase();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        const element = document.getElementById(id);
        if (element && window.location.hash === `#${id}`) {
          scrollToElement(element, id);
        }
      }, [id]);
      return <h2 id={id}>
        <a className="link link-hover" onClick={handleClick} href={`#${id}`}>{children}</a>
      </h2>;
    },
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
function scrollToElement(element: HTMLElement | null, id: any) {
  if (element) {
    window.scrollTo({
      top: element?.offsetTop - 150,
      behavior: 'instant'
    });
    window.history.pushState(null, '', `#${id}`);
  }
}
