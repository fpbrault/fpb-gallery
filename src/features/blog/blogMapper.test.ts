import { describe, expect, it } from "vitest";

import { mapPostList } from "@/features/blog/blogMapper";
import type { POST_LIST_QUERY_RESULT } from "@/sanity/sanity.types";

describe("mapPostList", () => {
  it("filters posts that cannot produce a public URL", () => {
    const input = {
      posts: [
        {
          _id: "valid",
          publishDate: null,
          coverImage: null,
          slug: { _type: "slug", current: "hello" },
          title: null,
          blurDataURL: null,
          excerpt: "Excerpt"
        },
        {
          _id: "invalid",
          publishDate: null,
          coverImage: null,
          slug: null,
          title: "Hidden",
          blurDataURL: null,
          excerpt: "Excerpt"
        }
      ],
      totalCount: 2
    } satisfies POST_LIST_QUERY_RESULT;

    expect(mapPostList(input)).toEqual({
      posts: [
        {
          id: "valid",
          coverImage: null,
          excerpt: "Excerpt",
          publishDate: null,
          slug: "hello",
          title: "Untitled post"
        }
      ],
      totalCount: 2
    });
  });
});
