import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createThemeInitializationScript,
  presentationConfig,
  resolveTheme
} from "@/config/presentation";

describe("presentation configuration", () => {
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    vi.restoreAllMocks();
  });

  it("locks the live typography and theme baseline in code", () => {
    expect(presentationConfig).toEqual({
      fonts: { body: "raleway", display: "raleway", cssVariable: "--font-site" },
      themes: { dark: "mytheme", light: "light", storageKey: "theme" }
    });
  });

  it.each([
    ["mytheme", false, "mytheme"],
    ["light", true, "light"],
    ["legacy-theme", true, "mytheme"],
    [null, false, "light"]
  ])("resolves stored theme %s with system dark %s", (stored, prefersDark, expected) => {
    expect(resolveTheme(stored, prefersDark)).toBe(expected);
  });

  it.each([
    ["mytheme", false, "mytheme"],
    ["light", true, "light"],
    ["legacy-theme", true, "mytheme"],
    [null, false, "light"]
  ])(
    "initializes stored theme %s before paint with system dark %s",
    (stored, prefersDark, expected) => {
      if (stored) localStorage.setItem(presentationConfig.themes.storageKey, stored);

      const matchMedia = vi.fn().mockReturnValue({ matches: prefersDark });
      const initialize = new Function(
        "document",
        "localStorage",
        "matchMedia",
        createThemeInitializationScript()
      );

      initialize(document, localStorage, matchMedia);

      expect(document.documentElement.dataset.theme).toBe(expected);
      expect(localStorage.getItem(presentationConfig.themes.storageKey)).toBe(expected);
    }
  );
});
