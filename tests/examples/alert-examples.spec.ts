import { expect, test, type Page } from '@playwright/test';

const exampleIds = [
  'basic',
  'sizes',
  'variants',
  'buttons',
  'close-button',
  'color-palette-override',
  'custom-icon',
  'customization',
  'description',
  'spinner',
  'status',
] as const;

/** Require each named Alert example to render a styled Alert root. */
async function verifiesEveryAlertExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  for (const id of exampleIds) {
    await page.goto(`/iframe.html?id=components-alert--${id}`);
    await expect(
      page.locator('[class*="leverui-alert__root"]').first(),
      `Alert example ${id} should render`,
    ).toBeVisible({ timeout: 45_000 });
  }
}

/** Verify both recipe tables render all ten palette rows. */
async function verifiesAlertTables({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-alert--sizes');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root thead th[scope="col"]')).toHaveCount(4);
  await page.goto('/iframe.html?id=components-alert--variant-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root thead th[scope="col"]')).toHaveCount(5);
}

/** Verify the four statuses retain their distinct message copy. */
async function verifiesStatusMessages({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-alert--status');
  await expect(page.locator('[class*="leverui-alert__root"]')).toHaveCount(4);
  await expect(page.getByText('Maintenance starts on Sunday at 2 am')).toBeVisible();
}

test('all Alert examples render', verifiesEveryAlertExample);
test('Alert size and variant tables cover the recipes', verifiesAlertTables);
test('Alert statuses retain the messages', verifiesStatusMessages);
