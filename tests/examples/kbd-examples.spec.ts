import { expect, test, type Page } from '@playwright/test';

const counts = {
  basic: 1,
  combinations: 3,
  group: 5,
  'function-keys': 4,
  variants: 4,
  sizes: 3,
  'within-text': 1,
  'size-matrix': 30,
  'variant-matrix': 40,
} as const;

/** Verify the Kbd examples and both complete variant matrices. */
async function verifiesKbdStories({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  for (const [story, count] of Object.entries(counts)) {
    await page.goto(`/iframe.html?id=components-kbd--${story}`);
    await expect(page.locator('#storybook-root .leverui-kbd')).toHaveCount(count, {
      timeout: 45_000,
    });
  }
}

/** Ensure both matrices retain the ten palette rows. */
async function verifiesKbdMatrices({ page }: { page: Page }): Promise<void> {
  for (const story of ['size-matrix', 'variant-matrix']) {
    await page.goto(`/iframe.html?id=components-kbd--${story}`);
    await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  }
}

/** Keep single modifier keys square and aligned. */
async function verifiesFunctionKeyWidths({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-kbd--function-keys');
  const keys = page.locator('#storybook-root kbd');
  await expect(keys).toHaveText(['⌘', '⌥', '⇧', '⌃']);
  for (const key of await keys.all()) {
    await expect(key).toHaveCSS('min-width', '20px');
    const bounds = await key.boundingBox();
    expect([bounds?.width, bounds?.height]).toEqual([20, 20]);
  }
}

test('all Kbd examples and matrices render', verifiesKbdStories);
test('Kbd tables include all palettes', verifiesKbdMatrices);
test('Kbd modifier keys match widths', verifiesFunctionKeyWidths);
