// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { isValidSignature, revalidateTag } = vi.hoisted(() => ({
  isValidSignature: vi.fn(),
  revalidateTag: vi.fn()
}));

vi.mock("@sanity/webhook", () => ({
  isValidSignature,
  SIGNATURE_HEADER_NAME: "sanity-webhook-signature"
}));
vi.mock("next/cache", () => ({ revalidateTag }));

import { GET, POST } from "./route";

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SANITY_WEBHOOK_SECRET = "webhook-secret";
  });

  it("rejects unsigned requests", async () => {
    const response = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        body: JSON.stringify({ _id: "post-1", _type: "post" })
      })
    );
    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates only known tags after signature verification", async () => {
    isValidSignature.mockResolvedValue(true);
    const response = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: { "sanity-webhook-signature": "valid" },
        body: JSON.stringify({ _id: "album-1", _type: "album" })
      })
    );
    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledTimes(2);
    expect(revalidateTag).toHaveBeenCalledWith("albums", { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledWith("categories", { expire: 0 });
  });

  it("rejects oversized bodies before verification", async () => {
    const response = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: { "content-length": "20000" },
        body: "{}"
      })
    );
    expect(response.status).toBe(413);
  });

  it("rejects GET", async () => {
    expect((await GET()).status).toBe(405);
  });
});
