import { describe, expect, it } from "vitest";

import { collectPortableImages } from "@/features/content/portableImageRegistry";

function image(key: string, extra: Record<string, unknown> = {}) {
  return {
    _key: key,
    _type: "image",
    alt: `${key} alt`,
    asset: { _ref: "image-example-1200x800-jpg", _type: "reference" },
    ...extra
  };
}

describe("collectPortableImages", () => {
  it("recursively collects top-level and two-column images in document order", () => {
    const registry = collectPortableImages([
      image("top"),
      {
        _type: "layout-col-2",
        leftCol: [image("left")],
        rightCol: [image("right")]
      },
      image("bottom")
    ]);

    expect(registry.map(({ id }) => id)).toEqual(["top", "left", "right", "bottom"]);
  });

  it("filters missing assets and normalizes placeholders and decorative alt text", () => {
    const registry = collectPortableImages([
      image("missing", { asset: undefined }),
      image("decorative", {
        alt: "Ignored alt",
        decorative: true,
        placeholders: { metadata: { lqip: "data:image/jpeg;base64,blur" } }
      }),
      image("plain")
    ]);

    expect(registry).toHaveLength(2);
    expect(registry[0].slide).toMatchObject({
      alt: "",
      id: "decorative",
      lqip: "data:image/jpeg;base64,blur"
    });
    expect(registry[1].slide.lqip).toBeUndefined();
  });
});
