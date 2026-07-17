import { describe, expect, it } from "vitest";

import { mapHeaderData, mapSiteMetadata } from "@/features/site/siteMapper";
import type { HEADER_QUERY_RESULT, SITE_METADATA_QUERY_RESULT } from "@/sanity/sanity.types";
import { withTestStega } from "@/test/stega";

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

  it("cleans navigation and link controls while preserving their labels", () => {
    const label = withTestStega("Instagram");
    const metadata = {
      siteTitle: "Gallery",
      description: "Photos",
      author: "Author",
      socialLinks: [
        {
          name: label,
          type: withTestStega("instagram"),
          url: withTestStega("https://example.com")
        }
      ]
    } satisfies SITE_METADATA_QUERY_RESULT;
    const header = {
      showHome: true,
      pages: [
        {
          _type: "reference",
          title: "About",
          slug: withTestStega("about"),
          translations: [
            {
              language: withTestStega("fr"),
              title: "À propos",
              slug: withTestStega("a-propos")
            }
          ]
        }
      ]
    } satisfies HEADER_QUERY_RESULT;

    expect(mapSiteMetadata(metadata).socialLinks).toEqual([
      { name: label, type: "instagram", url: "https://example.com" }
    ]);
    expect(mapHeaderData(header, "fr").pages).toEqual([{ title: "À propos", slug: "a-propos" }]);
  });
});
