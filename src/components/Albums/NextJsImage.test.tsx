import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    blurDataURL,
    placeholder,
    ...props
  }: ComponentProps<"img"> & { blurDataURL?: string; placeholder?: string }) => {
    void blurDataURL;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- test double exposes Next Image props.
      <img {...props} alt={alt} data-placeholder={placeholder} />
    );
  }
}));

import { NextJsImageElement, type GalleryPhoto } from "./NextJsImage";

function renderPhoto(lqip?: string) {
  const photo: GalleryPhoto = {
    _key: "photo-1",
    _type: "image",
    alt: "Winter landscape",
    asset: {
      _ref: "image-4338b28bcb30c42a571234d34c1d4507b2704b98-3088x2048-jpg",
      _type: "reference"
    },
    decorative: false,
    description: undefined,
    featured: false,
    height: 2048,
    placeholders: { metadata: { lqip } },
    src: "https://cdn.sanity.io/image.jpg",
    title: "Winter",
    width: 3088
  };

  render(
    <NextJsImageElement
      context={{ height: photo.height, index: 0, photo, width: photo.width }}
      renderProps={{}}
    />
  );
}

describe("gallery Next Image placeholder", () => {
  it("uses an empty placeholder when Sanity has no LQIP", () => {
    renderPhoto();
    expect(screen.getByRole("img")).toHaveAttribute("data-placeholder", "empty");
  });

  it("uses the Sanity LQIP when it exists", () => {
    renderPhoto("data:image/jpeg;base64,blurred");
    expect(screen.getByRole("img")).toHaveAttribute("data-placeholder", "blur");
  });
});
