import { expect, test, type Page } from '@playwright/test';

/** Select two months and verify formatted inputs and machine dates agree. */
async function verifiesMonthRange({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-period-guide--month-range');
  const grid = page.getByTestId('date-picker-period-months');
  await expect(grid).toBeVisible({ timeout: 30_000 });
  await grid.getByRole('button', { name: 'March 2026' }).click();
  await grid.getByRole('button', { name: 'May 2026' }).click();
  await expect(page.getByTestId('date-picker-period-start')).toHaveValue('03/2026');
  await expect(page.getByTestId('date-picker-period-end')).toHaveValue('05/2026');
  await expect(page.getByTestId('date-picker-period-value')).toContainText('2026-03-01');
  await expect(page.getByTestId('date-picker-period-value')).toContainText('2026-05-01');
}

test('DatePicker selects and formats month ranges', verifiesMonthRange);

/** Select two years without allowing the picker to descend into month view. */
async function verifiesYearRange({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-period-guide--year-range');
  const grid = page.getByTestId('date-picker-period-years');
  await expect(grid).toBeVisible({ timeout: 30_000 });
  await grid.locator('td[data-value^="2026"] [data-date-picker-table-cell-trigger]').click();
  await grid.locator('td[data-value^="2028"] [data-date-picker-table-cell-trigger]').click();
  await expect(page.getByTestId('date-picker-period-start')).toHaveValue('2026');
  await expect(page.getByTestId('date-picker-period-end')).toHaveValue('2028');
  await expect(grid).toBeVisible();
}

test('DatePicker selects and formats year ranges', verifiesYearRange);

/** Verify the same period formatters work in single selection mode. */
async function verifiesSinglePeriods({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-period-guide--month');
  const monthGrid = page.getByTestId('date-picker-period-months');
  await expect(monthGrid).toBeVisible({ timeout: 30_000 });
  await monthGrid.getByRole('button', { name: 'April 2026' }).click();
  await expect(page.getByTestId('date-picker-period-start')).toHaveValue('04/2026');

  await page.goto('/iframe.html?id=components-datepicker-period-guide--year');
  const yearGrid = page.getByTestId('date-picker-period-years');
  await expect(yearGrid).toBeVisible({ timeout: 30_000 });
  await yearGrid.locator('td[data-value^="2027"] [data-date-picker-table-cell-trigger]').click();
  await expect(page.getByTestId('date-picker-period-start')).toHaveValue('2027');
}

test('DatePicker supports single month and year selection', verifiesSinglePeriods);

/** Select a month by keyboard, then return focus when the popup closes. */
async function verifiesMonthKeyboard({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-period-guide--month-popup');
  const trigger = page.getByRole('button', { name: 'Open month picker' });
  await trigger.click();
  const grid = page.getByTestId('date-picker-popup-period-months');
  await expect(grid).toBeVisible({ timeout: 30_000 });
  await page.keyboard.press('ArrowRight');
  await expect(grid.getByRole('button', { name: 'April 2026' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('date-picker-popup-period-input')).toHaveValue('04/2026');
  await expect(grid.getByRole('button', { name: 'April 2026' }).locator('..')).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('date-picker-popup-period-content')).toBeHidden();
  await expect(trigger).toBeFocused();
}

test('DatePicker month popup supports keyboard selection and focus return', verifiesMonthKeyboard);

/** Select a year without falling through to month or day views. */
async function verifiesYearKeyboard({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-period-guide--year-popup');
  const trigger = page.getByRole('button', { name: 'Open year picker' });
  await trigger.click();
  const grid = page.getByTestId('date-picker-popup-period-years');
  await expect(grid).toBeVisible({ timeout: 30_000 });
  await page.keyboard.press('ArrowRight');
  await expect(grid.getByRole('button', { name: '2027' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('date-picker-popup-period-input')).toHaveValue('2027');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
}

test('DatePicker year popup supports keyboard selection and focus return', verifiesYearKeyboard);
