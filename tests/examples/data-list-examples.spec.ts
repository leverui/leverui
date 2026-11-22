import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'sizes',
  'size-matrix',
  'orientation',
  'info',
  'separator',
  'variants',
] as const;

/** Require all Data List stories to render their values. */
async function verifiesDataListExamples({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-data-list--${id}`);
    await expect(page.locator('#storybook-root .leverui-data-list__itemValue').first()).toHaveText(
      /\S/,
    );
  }
}

/** Keep the three sizes and popover explanations usable. */
async function verifiesDataListDetails({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-data-list--size-matrix');
  await expect(page.locator('#storybook-root tbody .leverui-data-list__root')).toHaveCount(3);
  await expect(page.locator('#storybook-root thead td').first()).toHaveCSS('padding-right', '32px');
  await expect(page.locator('#storybook-root thead td').nth(1)).toHaveCSS('font-size', '14px');
  await page.goto('/iframe.html?id=components-data-list--info');
  await page.getByRole('button', { name: 'info' }).first().click();
  await expect(page.getByRole('dialog', { name: 'Total for the last 30 days' })).toBeVisible();
}

test('all Data List examples render', verifiesDataListExamples);
test('Data List sizes and information popover work', verifiesDataListDetails);
