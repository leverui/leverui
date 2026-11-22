import { expect, test, type Page } from '@playwright/test';

/** Check custom formatting and parsing through the native editable input. */
async function verifiesFormatParse({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-locale-guide--format-parse');
  const input = page.getByTestId('date-picker-format-input');
  await expect(input).toHaveValue('14/03/26', { timeout: 30_000 });
  await input.fill('19/03/26');
  await input.press('Tab');
  await expect(page.getByTestId('date-picker-format-value')).toHaveText('2026-03-19');
  await expect(input).toHaveValue('19/03/26');
}

test('DatePicker applies caller formatting and parsing', verifiesFormatParse);

/** Verify the Persian calendar produces a Jalali year and localized grid. */
async function verifiesPersianCalendar({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-locale-guide--persian');
  const grid = page.getByTestId('date-picker-persian-days');
  await expect(grid).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[data-date-picker-range-text]').first()).toContainText(/۱۴۰۴|1404/);
  await expect(grid.locator('tbody tr')).not.toHaveCount(0);
  await expect(page.getByText('تاریخ را انتخاب کنید')).toBeVisible();
  const day = grid.locator('td[data-value]:not([aria-disabled="true"])').nth(15);
  await day.locator('[data-date-picker-table-cell-trigger]').click();
  await expect(day).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('date-picker-persian-input')).not.toHaveValue('');
}

test('DatePicker renders the Persian Jalali calendar', verifiesPersianCalendar);

/** Ensure fixedWeeks reacts and the grid grows to exactly six weeks. */
async function verifiesFixedWeeks({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-locale-guide--fixed-weeks');
  const rows = page.getByTestId('date-picker-fixed-days').locator('tbody tr');
  await expect(rows.first()).toBeVisible({ timeout: 30_000 });
  const ordinaryCount = await rows.count();
  expect(ordinaryCount).toBeLessThan(6);
  await page.getByRole('button', { name: 'Toggle fixed weeks' }).click();
  await expect(page.getByTestId('date-picker-fixed-state')).toHaveText('true');
  await expect(rows).toHaveCount(6);
}

test('DatePicker keeps six visible weeks when fixedWeeks changes', verifiesFixedWeeks);
