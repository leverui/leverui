import { expect, test, type Page } from '@playwright/test';

/** Keep time across calendar selection and update it with a native time input. */
async function verifiesDateTime({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-time-and-placement--with-time');
  const time = page.getByTestId('date-picker-time-input');
  const value = page.getByTestId('date-picker-time-value');
  await expect(time).toHaveValue('14:30', { timeout: 30_000 });
  await time.fill('09:45');
  await expect(value).toContainText('2026-03-14T09:45:00');
  await page
    .getByTestId('date-picker-time-days')
    .locator('td[data-value="2026-03-15"] [data-date-picker-table-cell-trigger]')
    .click();
  await expect(value).toContainText('2026-03-15T09:45:00');
  await expect(time).toHaveValue('09:45');
  await page.getByRole('button', { name: 'Clear date and time' }).click();
  await expect(value).toHaveText('');
  await time.fill('08:15');
  await expect(value).toContainText('2026-03-14T08:15:00');
}

test('DatePicker composes calendar dates with controlled time', verifiesDateTime);

/** Compare rendered geometry for a popup requested above its trigger. */
async function verifiesTopPlacement({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-time-and-placement--top-placement');
  const trigger = page.getByRole('button', { name: 'Open travel calendar' });
  await trigger.click();
  const grid = page.getByTestId('date-picker-top-days');
  await expect(grid).toBeVisible({ timeout: 30_000 });
  const triggerBox = await trigger.boundingBox();
  const popupBox = await page.getByTestId('date-picker-top-positioner').boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(popupBox).not.toBeNull();
  if (!triggerBox || !popupBox) return;
  expect(popupBox.y + popupBox.height).toBeLessThanOrEqual(triggerBox.y + 2);
}

test('DatePicker positions the popup above its trigger', verifiesTopPlacement);
