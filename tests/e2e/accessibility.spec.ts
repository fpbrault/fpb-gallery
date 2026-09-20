import { expect, test, type Page } from "@playwright/test";
import * as axeCore from "axe-core";

type AxeViolation = {
  id: string;
  impact: string | null;
  help: string;
  nodes: Array<{
    html: string;
    target: string[];
  }>;
};

async function waitForAnimationsToFinish(page: Page, selector: string) {
  await page.locator(selector).evaluate(async (element) => {
    const animations = element.getAnimations({ subtree: true });
    await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
  });
}

async function expectNoAccessibilityViolations(page: Page) {
  await page.addScriptTag({ content: axeCore.source });

  const violations = await page.evaluate(async () => {
    const axe = (
      window as unknown as {
        axe: {
          run: () => Promise<{ violations: AxeViolation[] }>;
        };
      }
    ).axe;

    const result = await axe.run();
    return result.violations.map(({ id, impact, help, nodes }) => ({
      id,
      impact,
      help,
      nodes: nodes.map(({ html, target }) => ({ html, target }))
    }));
  });

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

for (const path of ["/", "/gallery", "/blog", "/fr", "/fr/gallery", "/fr/blog"]) {
  test(`${path} has no automated accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await expectNoAccessibilityViolations(page);
  });
}

test("the open mobile navigation has no automated accessibility violations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "open sidebar" }).click();
  await expect(page.getByRole("button", { name: "close sidebar" })).toBeVisible();
  await waitForAnimationsToFinish(page, ".drawer-side");

  await expectNoAccessibilityViolations(page);
});

test("an open album lightbox has no automated accessibility violations", async ({ page }) => {
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

  const firstImage = page.locator("main [data-sanity-edit-target] img").first();
  await expect(firstImage).toBeVisible();
  await firstImage.click();
  await expect(page).toHaveURL(/[?&]imageId=/);

  await expectNoAccessibilityViolations(page);
});
