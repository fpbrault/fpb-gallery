"use server";

import { refresh, updateTag } from "next/cache";

import { getPreviewRefreshTags } from "@/lib/previewRefreshTags";

export async function refreshPreview(documentType?: string) {
  for (const tag of getPreviewRefreshTags(documentType)) updateTag(tag);
  refresh();
}
