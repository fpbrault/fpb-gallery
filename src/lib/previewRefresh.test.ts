// @vitest-environment node
import { describe, expect, it } from "vitest";

import { getPreviewRefreshTags } from "@/lib/previewRefreshTags";

describe("preview refresh tags", () => {
  it.each([
    ["post", ["posts"]],
    ["album", ["albums", "categories"]],
    ["category", ["albums", "categories"]],
    ["page", ["navigation", "pages"]],
    ["pageList", ["navigation"]],
    ["siteSettings", ["site-settings"]]
  ])("maps %s mutations to their server cache tags", (documentType, tags) => {
    expect(getPreviewRefreshTags(documentType)).toEqual(tags);
  });

  it("falls back to all known tags for manual or unknown refreshes", () => {
    expect(getPreviewRefreshTags()).toEqual([
      "albums",
      "categories",
      "navigation",
      "pages",
      "posts",
      "site-settings"
    ]);
    expect(getPreviewRefreshTags("unknown")).toEqual(getPreviewRefreshTags());
  });
});
