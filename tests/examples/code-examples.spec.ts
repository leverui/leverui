import { expect, test, type Page } from '@playwright/test';

const storyIds = ['basic', 'colors', 'sizes', 'variants', 'size-matrix', 'variant-matrix'] as const;

/** Require each Code story to render its inline sample. */
async function verifiesCodeExamples({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=typography-code--${id}`);
    await expect(page.locator('#storybook-root .leverui-code').first()).toContainText(
      'console.log',
    );
  }
}

/** Keep the table dimensions and renamed visible copy. */
async function verifiesCodeTables({ page }: { page: Page }): Promise<void> {
  for (const id of ['size-matrix', 'variant-matrix']) {
    await page.goto(`/iframe.html?id=typography-code--${id}`);
    await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
    await expect(
      page.locator('#storybook-root tbody tr').first().locator('.leverui-code'),
    ).toHaveCount(id === 'size-matrix' ? 4 : 5);
    await expect(page.locator('#storybook-root thead th').nth(1)).toHaveCSS('font-size', '14px');
    await expect(page.locator('#storybook-root .leverui-code').first()).toContainText(
      'Lever UI v3!',
    );
    if (id === 'variant-matrix') {
      await expect(page.locator('#storybook-root .leverui-code').first()).toHaveCSS(
        'height',
        '32px',
      );
      await expect(page.locator('#storybook-root tbody tr').first()).toHaveCSS('height', '70px');
    }
  }
}

test('all four Code examples render', verifiesCodeExamples);
test('Code tables keep the dimensions and visible copy', verifiesCodeTables);
