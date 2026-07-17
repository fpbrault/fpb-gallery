import Link from "next/link";
import type { ReactNode } from "react";
import { stegaClean } from "next-sanity";
import { useLocale } from "@/components/context/LocaleContext";
import { localizePath } from "@/i18n/config";

export type InternalLinkValue = {
  type?: "album" | "page" | "post";
  slug?: string | { current?: string };
};

export function PTInternalLink({
  value,
  children
}: {
  value: InternalLinkValue;
  children: ReactNode;
}) {
  const { locale } = useLocale();
  const slug = stegaClean(typeof value.slug === "string" ? value.slug : value.slug?.current);
  const type = stegaClean(value.type);
  if (!slug) return <>{children}</>;

  const prefix = type === "album" ? "/album" : type === "post" ? "/blog" : "";
  return (
    <Link className="link link-primary" href={localizePath(`${prefix}/${slug}`, locale)}>
      {children}
    </Link>
  );
}
