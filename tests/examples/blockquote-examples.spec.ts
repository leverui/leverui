import { expect, test, type Page } from '@playwright/test';

const exampleIds = [
  'basic',
  'variants',
  'colors',
  'variant-matrix',
  'avatar',
  'cite',
  'custom-icon',
  'icon',
  'justify',
] as const;

/** Require each Blockquote example to render its quote content. */
async function verifiesEveryBlockquoteExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  for (const id of exampleIds) {
    await page.goto(`/iframe.html?id=components-blockquote--${id}`);
    await expect(
      page.locator('[class*="leverui-blockquote__content"]').first(),
      `Blockquote example ${id} should render`,
    ).toBeVisible({ timeout: 45_000 });
  }
}

/** Verify the three variants appear for every palette. */
async function verifiesVariantTable({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-blockquote--variant-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root thead th')).toHaveCount(4);
  await expect(page.locator('#storybook-root figure')).toHaveCount(30);
}

/** Keep quote, caption, and avatar semantics in one composition. */
async function verifiesAvatarComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-blockquote--avatar');
  const figure = page.locator('#storybook-root figure');
  await expect(figure.locator('blockquote')).toBeVisible();
  await expect(figure.locator('figcaption')).toBeVisible();
  await expect(figure.locator('[data-avatar-root]')).toHaveCount(1);
}

/** Verify the three justification settings and their quote captions. */
async function verifiesJustification({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-blockquote--justify');
  await expect(page.locator('[class*="leverui-blockquote__root"]')).toHaveCount(3);
  await expect(page.getByText('Wren Ashford')).toHaveCount(3);
}

test('all Blockquote examples render', verifiesEveryBlockquoteExample);
test('Blockquote variant table covers the palettes', verifiesVariantTable);
test('Blockquote justification example shows three settings', verifiesJustification);
test('Blockquote avatar composition preserves semantics', verifiesAvatarComposition);
