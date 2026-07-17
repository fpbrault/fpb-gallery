const ALL_PREVIEW_TAGS = [
  "albums",
  "categories",
  "navigation",
  "pages",
  "posts",
  "site-settings"
] as const;

const TAGS_BY_DOCUMENT_TYPE: Record<string, readonly string[]> = {
  album: ["albums", "categories"],
  category: ["albums", "categories"],
  page: ["navigation", "pages"],
  pageList: ["navigation"],
  post: ["posts"],
  siteSettings: ["site-settings"]
};

export function getPreviewRefreshTags(documentType?: string): readonly string[] {
  return (documentType && TAGS_BY_DOCUMENT_TYPE[documentType]) || ALL_PREVIEW_TAGS;
}
