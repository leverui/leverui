import { expect, test, type Page } from '@playwright/test';

/** Open a Date Picker example in its isolated gallery canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-date-picker--${id}`);
}

/** Open the calendar through its visible trigger. */
async function openCalendar(page: Page): Promise<void> {
  await page.locator('[data-date-picker-trigger]').first().click();
}

/** Select a visible, available calendar day. */
async function selectDay(page: Page): Promise<void> {
  await page
    .locator('[data-date-picker-table-cell-trigger]:not([aria-disabled="true"])')
    .filter({ visible: true })
    .first()
    .click();
}

/** Verify alternate views, paired months, and range inputs behave distinctly. */
async function verifiesCalendarModes({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'default-view');
  await openCalendar(page);
  await expect(
    page.locator('[data-date-picker-table-cell-trigger]').filter({ visible: true }),
  ).toHaveCount(12);

  await openStory(page, 'multiple-months');
  await openCalendar(page);
  await expect(page.locator('[data-date-picker-table]').filter({ visible: true })).toHaveCount(2);

  await openStory(page, 'range-selection');
  await expect(page.locator('[data-date-picker-input]')).toHaveCount(2);
  await openCalendar(page);
  await selectDay(page);
  await selectDay(page);
  await expect(page.locator('[data-date-picker-input]').nth(1)).not.toHaveValue('');
}

/** Verify preset actions update the range and a clear action resets it. */
async function verifiesPresetAndClear({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'presets');
  await openCalendar(page);
  await page
    .locator('[data-date-picker-preset-trigger]')
    .filter({ hasText: 'Last 7 days' })
    .click();
  await expect(page.locator('[data-date-picker-input]').nth(1)).not.toHaveValue('');

  await openStory(page, 'clear-icon');
  await openCalendar(page);
  await selectDay(page);
  await page.locator('[data-date-picker-clear-trigger]').click();
  await expect(page.locator('[data-date-picker-input]')).toHaveValue('');
}

/** Verify the time editor and Field validation update visible state. */
async function verifiesTimeAndField({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'with-time');
  await openCalendar(page);
  await expect(page.locator('input[type="time"]')).toHaveValue('14:30');
  await page.locator('input[type="time"]').fill('09:45');
  await expect(page.locator('input[type="time"]')).toHaveValue('09:45');

  await openStory(page, 'field');
  await page.getByRole('button', { name: 'Toggle invalid' }).click();
  await expect(page.getByText('Date of birth is required')).toBeVisible();
}

test('Date Picker calendar modes remain interactive', verifiesCalendarModes);
test('Date Picker presets and clear action update values', verifiesPresetAndClear);
test('Date Picker time editor and Field validation update', verifiesTimeAndField);
