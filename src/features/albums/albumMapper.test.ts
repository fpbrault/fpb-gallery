import { describe, expect, it } from "vitest";

import { mapAlbum } from "@/features/albums/albumMapper";
import type { ALBUM_QUERY_RESULT } from "@/sanity/sanity.types";
import { withTestStega } from "@/test/stega";

describe("mapAlbum", () => {
  it("normalizes legacy optional fields", () => {
    const input = {
      _id: "album-1",
      albumName: null,
      slug: { _type: "slug", current: "winter" },
      display: null,
      columns: null,
      description: null,
      category: null,
      images: null
    } satisfies ALBUM_QUERY_RESULT;

    expect(mapAlbum(input)).toEqual({
      id: "album-1",
      name: "Untitled album",
      slug: "winter",
      images: [],
      category: null,
      columns: 3,
      description: [],
      display: "rows"
    });
  });

  it("treats documents without a usable slug as missing", () => {
    const input = {
      _id: "album-1",
      albumName: "Winter",
      slug: null,
      display: "rows",
      columns: 3,
      description: null,
      category: null,
      images: []
    } satisfies ALBUM_QUERY_RESULT;

    expect(mapAlbum(input)).toBeNull();
  });

  it("cleans structural preview values while preserving the album name", () => {
    const name = withTestStega("Winter");
    const input = {
      _id: "album-1",
      albumName: name,
      slug: { _type: "slug", current: withTestStega("winter") },
      display: withTestStega("masonry"),
      columns: 3,
      description: null,
      category: {
        categoryName: "Travel",
        slug: { _type: "slug", current: withTestStega("travel") }
      },
      images: []
    } satisfies ALBUM_QUERY_RESULT;

    expect(mapAlbum(input)).toMatchObject({
      name,
      slug: "winter",
      display: "masonry",
      category: { name: "Travel", slug: "travel" }
    });
  });
});
