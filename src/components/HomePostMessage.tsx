"use client";

import Link from "next/link";
import { useLocale } from "@/components/context/LocaleContext";
import { localizePath } from "@/i18n/config";
import type { PostSummary } from "@/sanity/types";

export default function HomePostMessage({ post }: { post: PostSummary }) {
  const { locale, t } = useLocale();
  return (
    <div className="p-2 mb-2 rounded sm:mx-1 card bg-base-300">
      <p>{t("home.readPost")}</p>
      <Link
        className="text-2xl font-bold text-center font-display link link-hover link-primary"
        href={localizePath("/blog/" + post.slug.current, locale)}
      >
        {post?.title ?? "Untitled"}
      </Link>
    </div>
  );
}
