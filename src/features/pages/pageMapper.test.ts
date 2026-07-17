import { describe, expect, it } from "vitest";

import { mapPage } from "@/features/pages/pageMapper";
import type { PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import { withTestStega } from "@/test/stega";

describe("mapPage", () => {
  it("normalizes content and filters unusable translations", () => {
    const input = {
      _id: "page-1",
      title: null,
      slug: { _type: "slug", current: "about" },
      language: "en",
      content: null,
      _translations: [
        {
          language: "fr",
          title: "À propos",
          slug: { _type: "slug", current: "a-propos" }
        },
        { language: "de", title: "Über", slug: { _type: "slug", current: "uber" } }
      ]
    } satisfies PAGE_QUERY_RESULT;

    expect(mapPage(input)).toEqual({
      id: "page-1",
      content: [],
      locale: "en",
      slug: "about",
      title: "Untitled page",
      translations: [{ locale: "fr", slug: "a-propos", title: "À propos" }]
    });
  });

  it("rejects documents outside the supported locale contract", () => {
    const input = {
      _id: "page-1",
      title: "Über",
      slug: { _type: "slug", current: "uber" },
      language: "de",
      content: null,
      _translations: []
    } satisfies PAGE_QUERY_RESULT;

    expect(mapPage(input)).toBeNull();
  });

  it("cleans structural preview values while preserving editable text", () => {
    const title = withTestStega("About");
    const input = {
      _id: "page-1",
      title,
      slug: { _type: "slug", current: withTestStega("about") },
      language: withTestStega("en"),
      content: null,
      _translations: []
    } satisfies PAGE_QUERY_RESULT;

    expect(mapPage(input)).toMatchObject({ locale: "en", slug: "about", title });
  });
});
