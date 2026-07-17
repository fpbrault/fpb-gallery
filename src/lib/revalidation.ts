export const revalidationTags = {
  album: ["albums", "categories"],
  category: ["categories", "albums"],
  page: ["pages", "navigation"],
  pageList: ["navigation"],
  post: ["posts"],
  siteSettings: ["site-settings", "navigation", "pages", "posts", "albums", "categories"],
  all: ["site-settings", "navigation", "pages", "posts", "albums", "categories"]
} as const;

export type RevalidatableDocumentType = keyof typeof revalidationTags;

export function tagsForDocumentType(type: RevalidatableDocumentType): string[] {
  return [...revalidationTags[type]];
}
