import { expect, test, type Page } from '@playwright/test';

const exampleIds = [
  'basic',
  'icon',
  'variants',
  'sizes',
  'size-matrix',
  'variant-matrix',
  'context',
  'group',
] as const;

/** Require each named Badge example to mount a styled Badge. */
async function verifiesEveryBadgeExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  for (const id of exampleIds) {
    await page.goto(`/iframe.html?id=components-badge--${id}`);
    await expect(
      page.locator('.leverui-badge').first(),
      `Badge example ${id} should render`,
    ).toBeVisible({ timeout: 45_000 });
  }
}

/** Verify the size and variant tables expose every authored choice. */
async function verifiesBadgeTables({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-badge--size-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root thead th')).toHaveCount(5);
  await expect(page.locator('#storybook-root .leverui-badge')).toHaveCount(40);
  await page.goto('/iframe.html?id=components-badge--variant-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root thead th')).toHaveCount(6);
  await expect(page.locator('#storybook-root .leverui-badge')).toHaveCount(50);
}

/** Verify the attached status pair preserves both labels. */
async function verifiesAttachedGroup({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-badge--group');
  await expect(page.getByText('Test coverage')).toBeVisible();
  await expect(page.getByText('92%')).toBeVisible();
}

/** Keep both icon badges as single icon compositions. */
async function verifiesIconBadges({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-badge--icon');
  const badges = page.locator('#storybook-root .leverui-badge');
  await expect(badges).toHaveCount(2);
  await expect(badges.locator('svg.lucide')).toHaveCount(2);
}

test('all Badge examples render', verifiesEveryBadgeExample);
test('Badge tables cover the recipes', verifiesBadgeTables);
test('Badge group retains both status labels', verifiesAttachedGroup);
test('Badge icon examples render a single icon each', verifiesIconBadges);
