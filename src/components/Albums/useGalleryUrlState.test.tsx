import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({
  pathname: "/album/winter",
  push: vi.fn(),
  query: "filter=featured",
  replace: vi.fn()
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ push: navigation.push, replace: navigation.replace }),
  useSearchParams: () => new URLSearchParams(navigation.query)
}));

import { buildGalleryUrl, useGalleryUrlState } from "./useGalleryUrlState";

describe("gallery URL state", () => {
  beforeEach(() => {
    navigation.pathname = "/album/winter";
    navigation.query = "filter=featured";
    navigation.push.mockReset();
    navigation.replace.mockReset();
  });

  it("opens, navigates, and closes while preserving unrelated parameters and scroll", () => {
    const { result } = renderHook(() => useGalleryUrlState(["first", "second"]));

    act(() => result.current.open("first"));
    expect(navigation.push).toHaveBeenCalledWith("/album/winter?filter=featured&imageId=first", {
      scroll: false
    });

    navigation.query = "filter=featured&imageId=first";
    act(() => result.current.view("second"));
    expect(navigation.replace).toHaveBeenLastCalledWith(
      "/album/winter?filter=featured&imageId=second",
      { scroll: false }
    );

    act(() => result.current.close());
    expect(navigation.replace).toHaveBeenLastCalledWith("/album/winter?filter=featured", {
      scroll: false
    });
  });

  it("removes an invalid deep link without disturbing other parameters", async () => {
    navigation.query = "imageId=missing&filter=featured";
    renderHook(() => useGalleryUrlState(["first"]));

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith("/album/winter?filter=featured", {
        scroll: false
      })
    );
  });

  it("encodes stable image IDs", () => {
    expect(buildGalleryUrl("/album/winter", "", "image one")).toBe(
      "/album/winter?imageId=image+one"
    );
  });
});
