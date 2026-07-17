import { describe, expect, it } from "vitest";

import { mapPostList } from "@/features/blog/blogMapper";
import type { POST_LIST_QUERY_RESULT } from "@/sanity/sanity.types";
import { withTestStega } from "@/test/stega";

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

  it("cleans route and date values while preserving editable text", () => {
    const title = withTestStega("Hello");
    const input = {
      posts: [
        {
          _id: "post-1",
          publishDate: withTestStega("2026-07-17T00:00:00.000Z"),
          coverImage: null,
          slug: { _type: "slug", current: withTestStega("hello") },
          title,
          blurDataURL: null,
          excerpt: "Excerpt"
        }
      ],
      totalCount: 1
    } satisfies POST_LIST_QUERY_RESULT;

    expect(mapPostList(input).posts[0]).toMatchObject({
      publishDate: "2026-07-17T00:00:00.000Z",
      slug: "hello",
      title
    });
  });
});
