import { expect, test, type Page } from '@playwright/test';

const counts = {
  basic: 1,
  mixed: 12,
  palette: 5,
  'with-alpha': 4,
  'with-badge': 1,
  'with-sizes': 7,
  'with-transparent': 1,
} as const;

/** Check that each swatch example renders its expected samples. */
async function verifiesColorSwatchStories({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  for (const [story, count] of Object.entries(counts)) {
    await page.goto(`/iframe.html?id=components-color-swatch--${story}`);
    await expect(page.locator('#storybook-root .leverui-color-swatch')).toHaveCount(count, {
      timeout: 45_000,
    });
  }
}

/** Verify the fully transparent value survives rendering. */
async function verifiesTransparentSwatch({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-color-swatch--with-transparent');
  await expect(page.locator('.leverui-color-swatch')).toHaveAttribute(
    'data-value',
    'rgba(0, 0, 0, 0)',
  );
}

test('all seven Color Swatch examples render', verifiesColorSwatchStories);
test('transparent swatch preserves its RGBA value', verifiesTransparentSwatch);
