import { describe, expect, it } from "vitest";
import { getLocalizedString } from "./localizedValue";

describe("getLocalizedString", () => {
  it("reads legacy v4 entries where the language is stored in _key", () => {
    expect(
      getLocalizedString(
        [
          { _key: "en", value: "English title" },
          { _key: "fr", value: "Titre français" }
        ],
        "fr"
      )
    ).toBe("Titre français");
  });

  it("reads v5 entries where the language is stored in language", () => {
    expect(
      getLocalizedString(
        [
          { _key: "random-en", language: "en", value: "English title" },
          { _key: "random-fr", language: "fr", value: "Titre français" }
        ],
        "fr"
      )
    ).toBe("Titre français");
  });

  it("prefers the v5 language field when legacy and migrated entries are mixed", () => {
    expect(
      getLocalizedString(
        [
          { _key: "fr", language: "en", value: "English title" },
          { _key: "random-fr", language: "fr", value: "Titre français" }
        ],
        "fr"
      )
    ).toBe("Titre français");
  });

  it("falls back to the first valid value when the locale is unavailable", () => {
    expect(getLocalizedString([{ _key: "random", language: "en", value: "Fallback" }], "fr")).toBe(
      "Fallback"
    );
  });

  it("returns an empty string for malformed values", () => {
    expect(getLocalizedString(null, "en")).toBe("");
    expect(getLocalizedString([{ language: "en" }], "en")).toBe("");
  });
});
