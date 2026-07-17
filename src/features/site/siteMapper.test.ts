import { describe, expect, it } from "vitest";

import { mapHeaderData, mapSiteMetadata } from "@/features/site/siteMapper";
import type { HEADER_QUERY_RESULT, SITE_METADATA_QUERY_RESULT } from "@/sanity/sanity.types";

describe("site mappers", () => {
  it("uses safe metadata defaults when settings are missing", () => {
    expect(mapSiteMetadata(null)).toMatchObject({
      author: "Felix Perron-Brault",
      description: "Photography portfolio",
      siteTitle: "Felix Perron-Brault Photographe",
      socialLinks: []
    });
  });

  it("resolves referenced and hardcoded navigation for the requested locale", () => {
    const input = {
      showHome: null,
      pages: [
        {
          _type: "reference",
          title: "About",
          slug: "about",
          translations: [{ language: "fr", title: "À propos", slug: "a-propos" }]
        },
        {
          _type: "hardcodedPage",
          title: "Blog",
          title_fr: null,
          slug: "blog",
          slug_fr: null
        }
      ]
    } satisfies HEADER_QUERY_RESULT;

    expect(mapHeaderData(input, "fr")).toEqual({
      showHome: true,
      pages: [
        { title: "À propos", slug: "a-propos" },
        { title: "Blog", slug: "blog" }
      ]
    });
  });

  it("filters incomplete social links", () => {
    const input = {
      siteTitle: "Gallery",
      description: "Photos",
      author: "Author",
      socialLinks: [{ name: "Instagram", type: "instagram", url: null }]
    } satisfies SITE_METADATA_QUERY_RESULT;

    expect(mapSiteMetadata(input).socialLinks).toEqual([]);
  });
});
