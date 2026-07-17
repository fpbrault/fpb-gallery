import { describe, expect, it } from "vitest";
import { createStegaConfig } from "./stegaConfig";

describe("Sanity stega configuration", () => {
  it("retains the Studio URL while stega encoding is disabled for published reads", () => {
    expect(createStegaConfig(false)).toEqual({ enabled: false, studioUrl: "/studio" });
  });
});
