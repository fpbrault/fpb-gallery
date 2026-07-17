import { describe, expect, it } from "vitest";
import {
  ALBUM_QUERY,
  LATEST_POST_QUERY,
  POST_CURSOR_QUERY,
  POST_LIST_QUERY,
  POST_QUERY
} from "./queries";

const V5_SELECTOR = "language == $locale";

describe("internationalized array queries", () => {
  it("selects v5 album descriptions by language", () => {
    expect(ALBUM_QUERY).toContain(`albumContent[${V5_SELECTOR}][0].value`);
    expect(ALBUM_QUERY).not.toContain("_key == $locale");
  });

  it.each([
    ["post list", POST_LIST_QUERY, 2],
    ["post cursor", POST_CURSOR_QUERY, 2],
    ["latest post", LATEST_POST_QUERY, 2],
    ["post detail and navigation", POST_QUERY, 6]
  ])("selects v5 localized values in the %s query", (_name, query, expectedCount) => {
    expect(query.split(V5_SELECTOR)).toHaveLength(expectedCount + 1);
    expect(query).not.toContain("_key == $locale");
  });
});
