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
