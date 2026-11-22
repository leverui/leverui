import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'sizes',
  'hide-outside-days',
  'controlled',
  'default-value',
  'range-selection',
  'multi-selection',
  'min-max',
  'unavailable-dates',
  'multiple-months',
  'locale',
  'time-grid',
  'max-selected',
  'week-numbers',
] as const;

/** Open one Date Picker Calendar story. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-date-picker-calendar--${id}`);
}

/** Require each named example to mount a real day table. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await openStory(page, id);
    await expect(page.locator('[data-date-picker-table]')).not.toHaveCount(0);
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Verify the size and month-count matrices. */
async function verifiesMatrices({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'sizes');
  await expect(page.locator('[data-date-picker-table]').filter({ visible: true })).toHaveCount(5);
  await openStory(page, 'multiple-months');
  await expect(page.locator('[data-date-picker-table]').filter({ visible: true })).toHaveCount(2);
  await openStory(page, 'week-numbers');
  await expect(page.locator('[data-type="week-number"]')).not.toHaveCount(0);
}

test('all Date Picker Calendar stories render', verifiesInventory);
test('Date Picker Calendar matrices and week numbers render', verifiesMatrices);
