import type { ReactNode } from "react";
import { stegaClean } from "next-sanity";

export type ExternalLinkValue = { blank?: boolean; href?: string };

export function PTExternalLink({
  value,
  children
}: {
  value: ExternalLinkValue;
  children: ReactNode;
}) {
  const { blank, href } = value;
  return (
    <a
      className="link link-secondary"
      href={stegaClean(href)}
      target={blank ? "_blank" : undefined}
      rel={blank ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
