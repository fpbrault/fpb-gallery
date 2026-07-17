import { expect, test } from "@playwright/test";

for (const path of ["/", "/gallery", "/blog", "/fr", "/fr/gallery", "/fr/blog"]) {
  test(`${path} loads with canonical metadata`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", /^https?:\/\//);
  });
}

test("unknown content returns a real 404", async ({ page }) => {
  const response = await page.goto("/definitely-not-a-real-page");
  expect(response?.status()).toBe(404);
});

test("theme selection persists without site metadata", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("checkbox", { name: "Toggle light and dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "mytheme");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "mytheme");
});

test("invalid legacy themes fall back to the system preference", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("theme", "legacy-theme"));
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "mytheme");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("theme"))).toBe("mytheme");
});
