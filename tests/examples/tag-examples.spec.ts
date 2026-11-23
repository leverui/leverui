import { expect, test, type Page } from '@playwright/test';

const counts = {
  basic: 2,
  icon: 3,
  variants: 12,
  sizes: 9,
  avatar: 4,
  close: 2,
  colors: 30,
  overflow: 1,
  'as-button': 1,
  'variant-matrix': 200,
  'size-matrix': 40,
} as const;

/** Confirm every Tag example renders its expected number of roots. */
async function verifiesTagStories({ page }: { page: Page }): Promise<void> {
  for (const [story, count] of Object.entries(counts)) {
    await page.goto(`/iframe.html?id=components-tag--${story}`);
    await expect(page.locator('#storybook-root .lui-tag__root')).toHaveCount(count);
  }
}

/** Check avatar, close control, and constrained label composition. */
async function verifiesTagParts({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tag--avatar');
  await expect(page.locator('#storybook-root img')).toHaveCount(4);
  await page.goto('/iframe.html?id=components-tag--close');
  await expect(page.locator('#storybook-root button')).toHaveCount(2);
  await page.goto('/iframe.html?id=components-tag--overflow');
  await expect(page.locator('#storybook-root .lui-tag__root')).toHaveCSS('max-width', '200px');
}

/** Keep every palette row and all compositions in the Tag tables. */
async function verifiesTagMatrices({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tag--variant-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root thead th')).toHaveText([
    '',
    'subtle',
    'solid',
    'outline',
    'surface',
  ]);
  await expect(
    page.locator('#storybook-root tbody tr:first-child td:nth-child(2) .lui-tag__root'),
  ).toHaveCount(5);
  await expect(page.locator('#storybook-root .lui-tag__root')).toHaveCount(200);

  await page.goto('/iframe.html?id=components-tag--size-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root thead th')).toHaveText(['', 'sm', 'md', 'lg', 'xl']);
  await expect(page.locator('#storybook-root .lui-tag__root')).toHaveCount(40);
}

test('all Tag examples render', verifiesTagStories);
test('Tag examples preserve avatar, close, and overflow parts', verifiesTagParts);
test('Tag tables include every palette and composition', verifiesTagMatrices);
