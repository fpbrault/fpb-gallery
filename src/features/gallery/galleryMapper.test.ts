import { describe, expect, it } from "vitest";

import type { ContentImage } from "@/features/content/models";
import { mapGalleryImages } from "@/features/gallery/galleryMapper";

function image(key: string, lqip?: string): ContentImage {
  return {
    _key: key,
    _type: "image",
    alt: `${key} alt`,
    asset: { _ref: "image-example-1200x800-jpg", _type: "reference" },
    decorative: false,
    description: [],
    featured: false,
    placeholders: { metadata: { lqip } },
    title: `${key} title`
  };
}

describe("mapGalleryImages", () => {
  it("keeps thumbnail and lightbox models aligned in source order", () => {
    const result = mapGalleryImages([
      image("first", "data:image/jpeg;base64,first"),
      image("second")
    ]);

    expect(result.thumbnails.map(({ id }) => id)).toEqual(["first", "second"]);
    expect(result.slides.map(({ id }) => id)).toEqual(["first", "second"]);
    expect(result.thumbnails[0]).toMatchObject({
      alt: "first alt",
      height: 1000,
      lqip: "data:image/jpeg;base64,first",
      width: 1500
    });
    expect(result.slides[0]).toMatchObject({ height: 2048, width: 3072 });
    expect(result.thumbnails[1].lqip).toBeUndefined();
  });

  it("does not render images with malformed or missing assets", () => {
    const malformed = image("broken");
    malformed.asset = { _ref: "broken-reference", _type: "reference" };

    expect(mapGalleryImages([malformed])).toEqual({ slides: [], thumbnails: [] });
  });
});
