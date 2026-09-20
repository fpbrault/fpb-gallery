// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { runSanityRequest } from "./runSanityRequest";

describe("runSanityRequest", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns successful requests unchanged", async () => {
    await expect(runSanityRequest("test-operation", async () => "ok")).resolves.toBe("ok");
  });

  it("logs structured operation context and rethrows failures", async () => {
    const error = new Error("Sanity unavailable");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      runSanityRequest("post-list", async () => {
        throw error;
      })
    ).rejects.toBe(error);

    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(consoleError.mock.calls[0][0]))).toEqual({
      event: "sanity_fetch_error",
      operation: "post-list",
      message: "Sanity unavailable"
    });
  });
});
