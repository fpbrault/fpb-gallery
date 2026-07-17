import { describe, expect, it } from "vitest";

import { blogCursorQuerySchema, decodeBlogCursor, encodeBlogCursor } from "./pagination";

describe("blog cursor input", () => {
  const cursor = {
    id: "post-123",
    publishDate: "2026-07-16T12:00:00.000Z"
  };

  it("round-trips an opaque publish date and document ID cursor", () => {
    const encoded = encodeBlogCursor(cursor);

    expect(encoded).not.toContain(cursor.publishDate);
    expect(decodeBlogCursor(encoded)).toEqual(cursor);
  });

  it("accepts a bounded request", () => {
    const result = blogCursorQuerySchema.parse({
      cursor: encodeBlogCursor(cursor),
      limit: "12",
      locale: "fr"
    });
    expect(result).toEqual({ cursor, limit: 12, locale: "fr" });
  });

  it.each([
    { cursor: "bad", limit: "3", locale: "en" },
    { cursor: encodeBlogCursor(cursor), limit: "13", locale: "en" },
    { cursor: encodeBlogCursor(cursor), limit: "3", locale: "es" }
  ])("rejects invalid query %#", (query) => {
    expect(blogCursorQuerySchema.safeParse(query).success).toBe(false);
  });
});
