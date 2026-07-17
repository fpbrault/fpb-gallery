// @vitest-environment node
import { describe, expect, it } from "vitest";

import { isAllowedPreviewPath } from "@/lib/preview";

describe("preview destination allowlist", () => {
  it.each(["/", "/gallery", "/blog/a-post", "/album/an-album", "/fr/gallery", "/about/team"])(
    "allows site path %s",
    (path) => expect(isAllowedPreviewPath(path)).toBe(true)
  );

  it.each([
    null,
    "https://evil.example",
    "//evil.example",
    "/api/revalidate",
    "/studio",
    "/_next/static/a.js"
  ])("rejects unsafe destination %s", (path) => expect(isAllowedPreviewPath(path)).toBe(false));
});
