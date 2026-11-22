import { expect, test, type Page } from '@playwright/test';

const exampleIds = [
  'basic',
  'group-stacking',
  'persona',
  'sizes',
  'variants',
  'ring',
  'size-matrix',
  'variant-matrix',
  'badge',
  'colors',
  'fallback',
  'group',
  'overflow',
  'random-color',
  'shape',
  'store',
] as const;

/** Require each Avatar example to render an Avatar root. */
async function verifiesEveryAvatarExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(150_000);
  for (const id of exampleIds) {
    await page.goto(`/iframe.html?id=components-avatar--${id}`);
    await expect(
      page.locator('[class*="leverui-avatar__root"]').first(),
      `Avatar example ${id} should render`,
    ).toBeVisible({ timeout: 45_000 });
  }
}

/** Verify the full Avatar size and variant tables across ten palettes. */
async function verifiesAvatarTables({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-avatar--size-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root thead th')).toHaveCount(8);
  await expect(page.locator('[data-avatar-root]')).toHaveCount(210);
  await page.goto('/iframe.html?id=components-avatar--variant-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root thead th')).toHaveCount(4);
  await expect(page.locator('[data-avatar-root]')).toHaveCount(90);
}

/** Match the square, rounded, and circular radii. */
async function verifiesAvatarShapes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-avatar--shape');
  const avatars = page.locator('[data-avatar-root]');
  await expect(avatars).toHaveCount(3);
  for (const [index, radius] of ['0px', '6px', '9999px'].entries()) {
    await expect(avatars.nth(index)).toHaveCSS('border-radius', radius);
  }
}

/** Verify the overflow trigger exposes the two hidden names. */
async function verifiesOverflowMenu({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-avatar--overflow');
  await page.getByRole('button', { name: '+2' }).click();
  await expect(page.getByRole('menuitem', { name: 'Greta Lindqvist' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Hollis Grant' })).toBeVisible();
}

/** Verify the caller-owned Avatar displays its load status. */
async function verifiesStoreStatus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-avatar--store');
  await expect(page.locator('#storybook-root code')).toContainText(/loaded|not loaded/);
}

test('all Avatar examples render', verifiesEveryAvatarExample);
test('Avatar tables cover the recipes', verifiesAvatarTables);
test('Avatar overflow menu reveals hidden names', verifiesOverflowMenu);
test('Avatar store example exposes image status', verifiesStoreStatus);
test('Avatar shape variants match the radii', verifiesAvatarShapes);
