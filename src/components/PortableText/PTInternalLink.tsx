import Link from "next/link";
import type { ReactNode } from "react";
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
  const slug = typeof value.slug === "string" ? value.slug : value.slug?.current;
  if (!slug) return <>{children}</>;

  const prefix = value.type === "album" ? "/album" : value.type === "post" ? "/blog" : "";
  return (
    <Link className="link link-primary" href={localizePath(`${prefix}/${slug}`, locale)}>
      {children}
    </Link>
  );
}
