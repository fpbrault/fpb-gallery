// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));

vi.mock("next/og", () => ({
  ImageResponse: class extends Response {
    constructor(_element: unknown, init: ResponseInit) {
      super("image", init);
    }
  }
}));
vi.mock("@/sanity/lib/client", () => ({ getSanityClient: () => ({ fetch }) }));
vi.mock("@/sanity/lib/image", () => ({
  urlForImage: () => ({
    width: () => ({
      height: () => ({ fit: () => ({ url: () => "https://cdn.example/image.jpg" }) })
    })
  })
}));

import { OG_ALBUM_IMAGE_QUERY, OG_POST_IMAGE_QUERY } from "@/sanity/queries";
import { GET } from "./route";

describe("GET /api/og", () => {
  beforeEach(() => vi.clearAllMocks());

  it("looks up a post cover by stable document ID", async () => {
    fetch.mockResolvedValue(null);

    const response = await GET(
      new Request("https://fpbrault.com/api/og?title=Post&postId=post-123")
    );

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledWith(OG_POST_IMAGE_QUERY, { id: "post-123" });
  });

  it("looks up an album cover by stable document ID", async () => {
    fetch.mockResolvedValue(null);

    const response = await GET(
      new Request("https://fpbrault.com/api/og?title=Album&albumId=album-123")
    );

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledWith(OG_ALBUM_IMAGE_QUERY, { id: "album-123" });
  });

  it("falls back to the generic image when Sanity fails", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetch.mockRejectedValue(new Error("Sanity unavailable"));

    const response = await GET(
      new Request("https://fpbrault.com/api/og?title=Post&postId=post-123")
    );

    expect(response.status).toBe(200);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('"event":"og_query_error"'));
    error.mockRestore();
  });

  it("rejects oversized identifiers", async () => {
    const response = await GET(
      new Request(`https://fpbrault.com/api/og?postId=${"x".repeat(121)}`)
    );

    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });
});
