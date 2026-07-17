"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useGalleryUrlState(imageIds: string[]) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const imageId = searchParams.get("imageId");
  const index = imageId ? imageIds.indexOf(imageId) : -1;

  useEffect(() => {
    if (imageId && index === -1) {
      router.replace(buildGalleryUrl(pathname, query, null), { scroll: false });
    }
  }, [imageId, index, pathname, query, router]);

  return {
    close: () => router.replace(buildGalleryUrl(pathname, query, null), { scroll: false }),
    index,
    open: (id: string) => router.push(buildGalleryUrl(pathname, query, id), { scroll: false }),
    view: (id: string) => router.replace(buildGalleryUrl(pathname, query, id), { scroll: false })
  };
}

export function buildGalleryUrl(pathname: string, query: string, imageId: string | null) {
  const params = new URLSearchParams(query);
  if (imageId) params.set("imageId", imageId);
  else params.delete("imageId");
  const nextQuery = params.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}
