import { describe, expect, it } from "vitest";

import { isLocale, localizePath } from "./config";

describe("localization paths", () => {
  it("keeps English unprefixed and French prefixed", () => {
    expect(localizePath("/gallery", "en")).toBe("/gallery");
    expect(localizePath("/gallery", "fr")).toBe("/fr/gallery");
    expect(localizePath("/fr/gallery", "en")).toBe("/gallery");
  });

  it("only accepts configured locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("es")).toBe(false);
  });
});
