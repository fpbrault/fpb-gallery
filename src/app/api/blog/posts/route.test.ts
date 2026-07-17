// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { encodeBlogCursor } from "@/lib/pagination";

const { getNextCursor, getPostsAfter } = vi.hoisted(() => ({
  getNextCursor: vi.fn(),
  getPostsAfter: vi.fn()
}));

vi.mock("@/sanity/repositories/blogRepository", () => ({ getNextCursor, getPostsAfter }));

import { GET } from "./route";

describe("GET /api/blog/posts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("decodes an opaque cursor before querying and returns a server-generated cursor", async () => {
    const cursor = { id: "post-2", publishDate: "2026-07-16T12:00:00.000Z" };
    const items = [{ id: "post-1", publishDate: "2026-07-15T12:00:00.000Z" }];
    getPostsAfter.mockResolvedValue(items);
    getNextCursor.mockReturnValue("next-opaque-cursor");

    const response = await GET(
      new Request(
        `https://fpbrault.com/api/blog/posts?locale=en&limit=3&cursor=${encodeBlogCursor(cursor)}`
      )
    );

    expect(response.status).toBe(200);
    expect(getPostsAfter).toHaveBeenCalledWith("en", cursor, 3);
    expect(getNextCursor).toHaveBeenCalledWith(items);
    await expect(response.json()).resolves.toEqual({
      items,
      nextCursor: "next-opaque-cursor"
    });
  });

  it("rejects a malformed cursor without querying Sanity", async () => {
    const response = await GET(
      new Request("https://fpbrault.com/api/blog/posts?locale=en&limit=3&cursor=not-a-cursor")
    );

    expect(response.status).toBe(400);
    expect(getPostsAfter).not.toHaveBeenCalled();
  });
});
