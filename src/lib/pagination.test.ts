import { describe, expect, it } from "vitest";

import { blogCursorQuerySchema } from "./pagination";

describe("blog cursor input", () => {
  it("accepts a bounded request", () => {
    const result = blogCursorQuerySchema.parse({
      cursor: "2026-07-16T12:00:00.000Z",
      limit: "12",
      locale: "fr"
    });
    expect(result).toEqual({ cursor: "2026-07-16T12:00:00.000Z", limit: 12, locale: "fr" });
  });

  it.each([
    { cursor: "bad", limit: "3", locale: "en" },
    { cursor: "2026-07-16T12:00:00.000Z", limit: "13", locale: "en" },
    { cursor: "2026-07-16T12:00:00.000Z", limit: "3", locale: "es" }
  ])("rejects invalid query %#", (query) => {
    expect(blogCursorQuerySchema.safeParse(query).success).toBe(false);
  });
});
