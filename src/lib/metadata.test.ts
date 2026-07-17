// @vitest-environment node
import { describe, expect, it } from "vitest";

import { createPageMetadata } from "./metadata";

const site = {
  author: "Felix",
  description: "Photography",
  siteTitle: "FPB",
  socialLinks: []
};

describe("page metadata", () => {
  it("uses actual localized paths while preserving the unprefixed English URL", () => {
    const metadata = createPageMetadata({
      locale: "fr",
      localizedPaths: { en: "/blog/english-slug", fr: "/blog/limace-francaise" },
      path: "/blog/limace-francaise",
      site,
      title: "Article"
    });

    expect(metadata.alternates?.canonical?.toString()).toBe(
      "https://fpbrault.com/fr/blog/limace-francaise"
    );
    expect(metadata.alternates?.languages).toEqual({
      en: new URL("https://fpbrault.com/blog/english-slug"),
      fr: new URL("https://fpbrault.com/fr/blog/limace-francaise")
    });
  });

  it("omits a missing translation instead of advertising a nonexistent URL", () => {
    const metadata = createPageMetadata({
      locale: "en",
      localizedPaths: { en: "/about" },
      path: "/about",
      site,
      title: "About"
    });

    expect(metadata.alternates?.languages).toEqual({
      en: new URL("https://fpbrault.com/about")
    });
  });

  it("adds a stable content ID to an album OG image URL", () => {
    const metadata = createPageMetadata({
      locale: "en",
      ogImage: { type: "album", id: "album-123" },
      path: "/album/winter",
      site,
      title: "Winter"
    });

    expect(metadata.openGraph?.images).toEqual([
      { url: new URL("https://fpbrault.com/api/og?title=Winter&albumId=album-123") }
    ]);
    expect(metadata.twitter?.images).toEqual([
      new URL("https://fpbrault.com/api/og?title=Winter&albumId=album-123")
    ]);
  });
});
