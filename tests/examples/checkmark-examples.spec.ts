import { expect, test, type Page } from '@playwright/test';

/** Verify all six Checkmark states and their glyphs. */
async function verifiesCheckmarkStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkmark--basic');
  const marks = page.locator('#storybook-root svg.lui-checkmark');
  await expect(marks).toHaveCount(6, { timeout: 45_000 });
  await expect(marks.nth(0).locator('polyline, path')).toHaveCount(0);
  await expect(marks.filter({ has: page.locator('polyline') })).toHaveCount(2);
  await expect(marks.filter({ has: page.locator('path') })).toHaveCount(2);
  await expect(marks.nth(3)).toHaveAttribute('data-disabled', '');
  await expect(marks.nth(4)).toHaveAttribute('data-disabled', '');
  await expect(marks.nth(5)).toHaveAttribute('data-disabled', '');
}

test('Checkmark renders the six states', verifiesCheckmarkStates);
