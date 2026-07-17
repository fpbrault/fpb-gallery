// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ disable: vi.fn() }));

vi.mock("next/headers", () => ({
  draftMode: async () => ({ disable: mocks.disable })
}));

import { GET } from "@/app/api/exit-preview/route";

describe("exit preview", () => {
  beforeEach(() => mocks.disable.mockReset());

  it("disables draft mode and redirects to the same-origin home page", async () => {
    const response = await GET(new Request("https://example.com/api/exit-preview"));

    expect(mocks.disable).toHaveBeenCalledOnce();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/");
  });
});
