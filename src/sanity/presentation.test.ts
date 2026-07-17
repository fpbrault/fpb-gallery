import { describe, expect, it } from "vitest";

import {
  getAlbumLocations,
  getCategoryLocations,
  getPageLocations,
  getPostLocations,
  presentationResolve,
  resolveCustomPageDocument
} from "@/sanity/presentation";

const context = (path: string) => ({ origin: "https://example.com", params: {}, path });

describe("Presentation resolvers", () => {
  it.each([
    ["/", "en", "home"],
    ["/fr", "fr", "home"],
    ["/about/team", "en", "about/team"],
    ["/fr/a-propos/equipe", "fr", "a-propos/equipe"]
  ])("resolves custom page %s", (path, language, slug) => {
    expect(resolveCustomPageDocument(context(path))).toMatchObject({
      params: { language, slug }
    });
  });

  it.each([
    "/_next/static/chunk.js",
    "/blog/post",
    "/fr/album/winter",
    "/category/portraits",
    "/gallery",
    "/robots.txt"
  ])("does not let custom pages own reserved route %s", (path) =>
    expect(resolveCustomPageDocument(context(path))).toBeUndefined()
  );

  it("orders specific document routes before the custom page catch-all", () => {
    expect(presentationResolve?.mainDocuments?.map(({ route }) => route)).toEqual([
      ["/blog/:slug", "/fr/blog/:slug"],
      ["/album/:slug", "/fr/album/:slug"],
      ["/category/:slug", "/fr/category/:slug"],
      ["/", "/fr"],
      "/:path*"
    ]);
  });

  it("uses safe selector aliases and avoids computed GROQ selections", () => {
    const selections: Array<[string, string]> = Object.values(
      presentationResolve?.locations ?? {}
    ).flatMap((resolver) =>
      "select" in resolver ? (Object.entries(resolver.select) as Array<[string, string]>) : []
    );

    expect(selections).toContainEqual(["categorySlug", "category->slug.current"]);
    expect(
      selections.every(
        ([alias, selector]) =>
          !alias.includes("(") && !alias.includes("->") && !selector.includes("(")
      )
    ).toBe(true);
  });

  it("maps localized pages and rejects reserved page slugs", () => {
    expect(getPageLocations({ language: "fr", slug: "a-propos/equipe", title: "Équipe" })).toEqual({
      locations: [{ title: "Équipe", href: "/fr/a-propos/equipe" }]
    });
    expect(getPageLocations({ language: "en", slug: "blog", title: "Blog page" })).toMatchObject({
      tone: "caution"
    });
  });

  it("maps translated posts and their index pages", () => {
    expect(
      getPostLocations({
        slugEn: "winter",
        slugFr: "hiver"
      }).locations
    ).toEqual([
      { title: "Post: winter", href: "/blog/winter" },
      { title: "Article : hiver", href: "/fr/blog/hiver" },
      { title: "Blog", href: "/blog" },
      { title: "Blog (French)", href: "/fr/blog" }
    ]);
    expect(getPostLocations({})).toMatchObject({ tone: "caution" });
  });

  it("adds album collection locations only when their images qualify", () => {
    const locations = getAlbumLocations({
      categorySlug: "travel",
      images: [{ featured: false }, { featured: true }],
      slug: "winter",
      title: "Winter"
    }).locations;

    expect(locations).toContainEqual({ title: "All photos", href: "/album/all" });
    expect(locations).toContainEqual({ title: "Featured photos", href: "/album/featured" });
    expect(getAlbumLocations(null)).toMatchObject({ tone: "caution" });
  });

  it("maps visible category locations in both locales", () => {
    expect(getCategoryLocations({ slug: "travel", title: "Travel" }).locations).toContainEqual({
      title: "Gallery (French)",
      href: "/fr/gallery"
    });
    expect(getCategoryLocations({})).toMatchObject({ tone: "caution" });
  });
});
