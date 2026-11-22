import { expect, test, type Page } from '@playwright/test';

/** Add and remove dates independently through the machine-owned day cells. */
async function verifiesMultipleSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-multiple--basic');
  const grid = page.getByTestId('date-picker-multiple-days');
  await expect(grid).toBeVisible({ timeout: 30_000 });
  const first = grid.locator('td[data-value="2026-03-14"]');
  const second = grid.locator('td[data-value="2026-03-16"]');
  await first.locator('[data-date-picker-table-cell-trigger]').click();
  await second.locator('[data-date-picker-table-cell-trigger]').click();
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('date-picker-multiple-value')).toContainText('03/14/2026');
  await expect(page.getByTestId('date-picker-multiple-value')).toContainText('03/16/2026');
  await first.locator('[data-date-picker-table-cell-trigger]').click();
  await expect(first).toHaveAttribute('aria-selected', 'false');
  await expect(second).toHaveAttribute('aria-selected', 'true');
}

test('DatePicker supports independent multiple-date selection', verifiesMultipleSelection);
