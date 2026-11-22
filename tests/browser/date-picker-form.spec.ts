import { expect, test, type Page } from '@playwright/test';

/** Select a date and read its serialized value from native FormData. */
async function verifiesFormSubmission({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-form--basic');
  await page.getByRole('button', { name: 'Open arrival calendar' }).click();
  await expect(page.getByTestId('date-picker-form-days')).toBeVisible({ timeout: 30_000 });
  await page
    .getByTestId('date-picker-form-days')
    .locator('[data-date-picker-table-cell-trigger][data-value="2026-03-14"]')
    .click();
  await expect(page.getByTestId('date-picker-form-input')).toHaveValue('03/14/2026');
  await page.getByRole('button', { name: 'Submit arrival' }).click();
  await expect(page.getByTestId('date-picker-form-result')).toHaveText('03/14/2026');
}

test('DatePicker submits a selected date through a native form', verifiesFormSubmission);

/** Traverse calendar days by keyboard and return focus when dismissed. */
async function verifiesKeyboardFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker--basic');
  const trigger = page.getByRole('button', { name: 'Open calendar' });
  await trigger.click();
  await expect(page.getByTestId('date-picker-days')).toBeVisible({ timeout: 30_000 });
  const focusedDay = page.locator('[data-date-picker-table-cell-trigger]:focus');
  await expect(focusedDay).toHaveAttribute('data-value', '2026-03-14');
  await page.keyboard.press('ArrowRight');
  await expect(focusedDay).toHaveAttribute('data-value', '2026-03-15');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('date-picker-content')).toBeHidden();
  await expect(trigger).toBeFocused();
}

test('DatePicker moves keyboard focus and returns it after Escape', verifiesKeyboardFocus);

/** Change calendar views through the same header controls consumers use. */
async function verifiesViewNavigation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker--basic');
  await page.getByRole('button', { name: 'Open calendar' }).click();
  await expect(page.getByTestId('date-picker-days')).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Switch to month view' }).click();
  await expect(page.getByTestId('date-picker-months')).toBeVisible();
  await page.getByRole('button', { name: 'Switch to year view' }).click();
  await expect(page.getByTestId('date-picker-years')).toBeVisible();
}

test('DatePicker navigates day, month, and year views', verifiesViewNavigation);
