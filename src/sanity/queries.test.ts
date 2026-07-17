import { describe, expect, it } from "vitest";
import {
  ALBUM_QUERY,
  LATEST_POST_QUERY,
  POST_CURSOR_QUERY,
  POST_LIST_QUERY,
  POST_QUERY
} from "./queries";

const COMPATIBLE_SELECTOR = "language == $locale || _key == $locale";

describe("internationalized array queries", () => {
  it("supports v4 and v5 album descriptions", () => {
    expect(ALBUM_QUERY).toContain(`albumContent[${COMPATIBLE_SELECTOR}][0].value`);
  });

  it.each([
    ["post list", POST_LIST_QUERY, 2],
    ["post cursor", POST_CURSOR_QUERY, 2],
    ["latest post", LATEST_POST_QUERY, 2],
    ["post detail and navigation", POST_QUERY, 6]
  ])("supports v4 and v5 localized values in the %s query", (_name, query, expectedCount) => {
    expect(query.split(COMPATIBLE_SELECTOR)).toHaveLength(expectedCount + 1);
    expect(query).not.toMatch(/\[(?:title|postContent|albumContent)?_key == \$locale\]/);
  });
});
