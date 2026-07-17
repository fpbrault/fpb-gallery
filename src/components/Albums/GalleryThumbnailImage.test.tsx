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

import { GalleryThumbnailImage } from "./GalleryThumbnailImage";
import type { GalleryThumbnail } from "@/features/gallery/models";

function renderPhoto(lqip?: string) {
  const photo: GalleryThumbnail = {
    alt: "Winter landscape",
    height: 1000,
    id: "photo-1",
    key: "photo-1",
    lqip,
    src: "https://cdn.sanity.io/image.jpg",
    title: "Winter",
    width: 1500
  };

  render(
    <GalleryThumbnailImage
      context={{ height: photo.height, index: 0, photo, width: photo.width }}
      renderProps={{}}
    />
  );
}

describe("gallery thumbnail placeholder", () => {
  it("uses an empty placeholder when Sanity has no LQIP", () => {
    renderPhoto();
    expect(screen.getByRole("img")).toHaveAttribute("data-placeholder", "empty");
  });

  it("uses the Sanity LQIP when it exists", () => {
    renderPhoto("data:image/jpeg;base64,blurred");
    expect(screen.getByRole("img")).toHaveAttribute("data-placeholder", "blur");
  });

  it("makes the full thumbnail a visual editing target", () => {
    renderPhoto();
    expect(screen.getByRole("img").closest("[data-sanity-edit-target]")).not.toBeNull();
  });
});
