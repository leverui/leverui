import { expect, test, type Page } from '@playwright/test';

const stories = ['basic', 'circular', 'aspect-ratio', 'fit', 'height', 'html-height'] as const;

/** Verify each Image example renders a native image with the source. */
async function verifiesImageStories({ page }: { page: Page }): Promise<void> {
  test.setTimeout(240_000);
  for (const story of stories) {
    await page.goto(`/iframe.html?id=components-image--${story}`, {
      waitUntil: 'domcontentloaded',
    });
    const image = page.locator('#storybook-root img');
    await expect(image).toHaveCount(1, { timeout: 45_000 });
    await expect(image).toHaveAttribute('src', /^\/demo-images\//);
  }
}

/** Verify circular cropping, contain fit, and native dimensions. */
async function verifiesImageDimensions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-image--circular', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#storybook-root img')).toHaveCSS('border-radius', '9999px');
  await page.goto('/iframe.html?id=components-image--fit', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#storybook-root img')).toHaveCSS('object-fit', 'contain');
  await page.goto('/iframe.html?id=components-image--html-height', {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.locator('#storybook-root img')).toHaveAttribute('height', '400px');
}

test('all six Image examples render', verifiesImageStories);
test('Image dimensions and object fit apply', verifiesImageDimensions);
