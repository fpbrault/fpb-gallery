import { describe, expect, it } from "vitest";

import { mapContentImage } from "@/features/content/imageMapper";

describe("mapContentImage", () => {
  it("rejects legacy images without an asset", () => {
    expect(mapContentImage({ _type: "image", alt: "Missing" }, "fallback")).toBeNull();
  });

  it("normalizes optional accessibility and presentation fields", () => {
    expect(
      mapContentImage(
        {
          _type: "image",
          asset: { _ref: "image-example-1200x800-jpg", _type: "reference" },
          decorative: true
        },
        "fallback"
      )
    ).toMatchObject({
      _key: "fallback",
      alt: "",
      decorative: true,
      description: [],
      featured: false,
      title: ""
    });
  });
});
