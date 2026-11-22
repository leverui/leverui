import { expect, test, type Page } from '@playwright/test';

/** Open one Date Input example in the Storybook canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-date-input--${id}`);
}

/** Check indexed range segments and the locale formatting. */
async function verifiesFormats({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'range');
  await expect(page.locator('[data-date-input-segment-group]')).toHaveCount(2);
  await expect(page.locator('[data-date-input-hidden-input]')).toHaveCount(2);

  await openStory(page, 'time-only');
  await expect(page.locator('[data-type="hour"]')).not.toHaveCount(0);
  await expect(page.locator('[data-type="minute"]')).not.toHaveCount(0);

  await openStory(page, 'rtl');
  await expect(page.getByText('تاريخ الميلاد')).toBeVisible();
  await expect(page.locator('[data-date-input-root]')).toHaveAttribute('dir', 'rtl');
}

/** Verify both time-zone display controls update the live segments. */
async function verifiesTimeZoneToggles({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'time-zone');
  await expect(page.locator('[data-type="timeZoneName"]')).not.toHaveCount(0);
  await page.getByText('Hide time zone', { exact: true }).click();
  await expect(page.locator('[data-type="timeZoneName"]')).toHaveCount(0);
  await page.getByText('12 hour', { exact: true }).click();
  await expect(page.locator('[data-type="dayPeriod"]')).toHaveCount(0);
}

/** Validate the Solid-owned name and date form on submission. */
async function verifiesForm({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'with-hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Name is required')).toBeVisible();
  await expect(page.getByText('Date of birth is required')).toBeVisible();
  await page.getByPlaceholder('Enter your name').fill('Ada');
  await expect(page.getByText('Name is required')).toHaveCount(0);
}

/** Select a calendar date and observe the linked segmented editor. */
async function verifiesCalendarLink({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'with-date-picker');
  await page.locator('[data-date-picker-trigger]').click();
  await expect(page.locator('[data-date-picker-content]')).toBeVisible();
  await page
    .locator('[data-date-picker-table-cell-trigger]:not([aria-disabled="true"])')
    .first()
    .click();
  await expect(page.locator('[data-date-input-hidden-input]')).not.toHaveValue('');
}

test('Date Input range, time, and locale formats render', verifiesFormats);
test('Date Input time-zone controls update segments', verifiesTimeZoneToggles);
test('Date Input form validates required fields', verifiesForm);
test('Date Input and Date Picker share a selected value', verifiesCalendarLink);
