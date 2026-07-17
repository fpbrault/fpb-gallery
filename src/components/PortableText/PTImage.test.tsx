import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt = "", ...props }: ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element -- test double exposes the image to jsdom.
    <img {...props} alt={alt} />
  )
}));

vi.mock("yet-another-react-lightbox", () => ({
  default: ({ index, open, slides }: { index: number; open: boolean; slides: unknown[] }) =>
    open ? <output data-index={index} data-slide-count={slides.length} /> : null
}));

import ImageContext from "./ImageContext";
import { PTImage } from "./PTImage";
import type { PortableImageRegistryEntry } from "@/features/content/portableImageRegistry";

function entry(id: string): PortableImageRegistryEntry {
  return {
    id,
    slide: { alt: `${id} alt`, height: 800, id, src: `/${id}-large.jpg`, width: 1200 },
    thumbnail: { height: 400, src: `/${id}.jpg`, width: 600 }
  };
}

describe("PTImage", () => {
  it("opens at its document-wide registry index with every image available", async () => {
    const user = userEvent.setup();
    const images = [entry("first"), entry("nested"), entry("last")];
    render(
      <ImageContext.Provider value={{ images }}>
        <PTImage
          value={{
            _key: "nested",
            _type: "image",
            asset: { _ref: "image-example-1200x800-jpg", _type: "reference" }
          }}
        />
      </ImageContext.Provider>
    );

    await user.click(screen.getByRole("button", { name: "Open image: nested alt" }));

    expect(screen.getByRole("img").closest("[data-sanity-edit-target]")).not.toBeNull();
    expect(screen.getByRole("status")).toHaveAttribute("data-index", "1");
    expect(screen.getByRole("status")).toHaveAttribute("data-slide-count", "3");
  });
});
