import { expect, test, type Page } from '@playwright/test';

const exampleIds = [
  'basic',
  'ellipsis',
  'icon',
  'menu',
  'separator',
  'variants',
  'sizes',
  'variant-matrix',
  'size-matrix',
] as const;

/** Require each named Breadcrumb example to render a navigable trail. */
async function verifiesEveryBreadcrumbExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  for (const id of exampleIds) {
    await page.goto(`/iframe.html?id=components-breadcrumb--${id}`);
    await expect(
      page.locator('[class*="leverui-breadcrumb__root"]').first(),
      `Breadcrumb example ${id} should render`,
    ).toBeVisible({ timeout: 45_000 });
  }
}

/** Keep the final breadcrumb as current-page text after two links. */
async function verifiesBasicSemantics({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-breadcrumb--basic');
  const trail = page.getByRole('navigation', { name: 'breadcrumb' });
  await expect(trail.locator('a')).toHaveCount(2);
  await expect(trail.locator('[aria-current="page"]')).toHaveText('Props');
}

/** Verify the middle breadcrumb opens all three menu items. */
async function verifiesBreadcrumbMenu({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-breadcrumb--menu');
  await page.getByRole('button', { name: 'Components' }).click();
  await expect(page.getByRole('menuitem', { name: 'Components' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Props' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Customization' })).toBeVisible();
}

/** Verify both table dimensions cover every palette and recipe option. */
async function verifiesBreadcrumbTables({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-breadcrumb--variant-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root thead th')).toHaveCount(3);
  await expect(page.locator('nav[aria-label="breadcrumb"]')).toHaveCount(40);
  await page.goto('/iframe.html?id=components-breadcrumb--size-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root thead th')).toHaveCount(4);
  await expect(page.locator('nav[aria-label="breadcrumb"]')).toHaveCount(60);
}

test('all Breadcrumb examples render', verifiesEveryBreadcrumbExample);
test('Breadcrumb menu opens its destinations', verifiesBreadcrumbMenu);
test('Breadcrumb tables cover the recipes', verifiesBreadcrumbTables);
test('Breadcrumb basic example preserves current-page semantics', verifiesBasicSemantics);
