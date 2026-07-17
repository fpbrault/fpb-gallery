import { describe, expect, it } from "vitest";

import { tagsForDocumentType } from "./revalidation";

describe("revalidation tag mapping", () => {
  it("invalidates album and category views for albums", () => {
    expect(tagsForDocumentType("album")).toEqual(["albums", "categories"]);
  });

  it("returns a fresh array", () => {
    const tags = tagsForDocumentType("post");
    tags.push("other");
    expect(tagsForDocumentType("post")).toEqual(["posts"]);
  });
});
