import { expect, test, type Page } from "@playwright/test";

async function openFirstAlbum(page: Page) {
  await page.goto("/gallery");

  const firstGalleryLink = page
    .locator('main a[href^="/album/"], main a[href^="/category/"]')
    .first();
  await expect(firstGalleryLink).toBeVisible();
  await firstGalleryLink.click();
  await expect(page).toHaveURL(/\/(?:album|category)\/[^/?#]+/);

  if (new URL(page.url()).pathname.startsWith("/category/")) {
    const firstAlbumLink = page.locator('main a[href^="/album/"]').first();
    await expect(firstAlbumLink).toBeVisible();
    await firstAlbumLink.click();
  }

  await expect(page).toHaveURL(/\/album\/[^/?#]+/);
}

test("gallery navigation and lightbox deep links work together", async ({ page }) => {
  await openFirstAlbum(page);

  const firstImage = page.locator("main [data-sanity-edit-target] img").first();
  await expect(firstImage).toBeVisible();
  await firstImage.click();

  await expect(page).toHaveURL(/[?&]imageId=/);
  const deepLink = page.url();

  await page.reload();
  await expect(page).toHaveURL(deepLink);

  await page.keyboard.press("Escape");
  await expect(page).not.toHaveURL(/[?&]imageId=/);
});

test("blog index navigates to real posts and paginates when more content exists", async ({
  page
}) => {
  await page.goto("/blog");

  const articles = page.locator("main article");
  await expect(articles.first()).toBeVisible();
  const initialCount = await articles.count();

  const loadMore = page.getByRole("button", { name: "Load More" });
  if (await loadMore.isVisible().catch(() => false)) {
    await loadMore.click();
    await expect.poll(() => articles.count()).toBeGreaterThan(initialCount);
  }

  const firstPostLink = page.locator('main article a[href^="/blog/"]').first();
  await expect(firstPostLink).toBeVisible();
  await firstPostLink.click();

  await expect(page).toHaveURL(/\/blog\/[^/?#]+/);
  await expect(page.locator("main article").first()).toBeVisible();
  await expect(page.locator("main article h2").first()).not.toHaveText("");
});

test("language switching preserves a dynamic album destination", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openFirstAlbum(page);

  const englishPath = new URL(page.url()).pathname;
  expect(englishPath).toMatch(/^\/album\//);

  const frenchPath = `/fr${englishPath}`;
  await page.getByLabel("open sidebar").click();

  const frenchLink = page.getByRole("link", { name: "Switch language to French" });
  await expect(frenchLink).toHaveAttribute("href", frenchPath);
  await frenchLink.click();
  await expect.poll(() => new URL(page.url()).pathname).toBe(frenchPath);

  await page.getByLabel("open sidebar").click();

  const englishLink = page.getByRole("link", { name: "Switch language to English" });
  await expect(englishLink).toHaveAttribute("href", englishPath);
  await englishLink.click();
  await expect.poll(() => new URL(page.url()).pathname).toBe(englishPath);
});
