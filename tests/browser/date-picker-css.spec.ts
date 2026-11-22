import { expect, test, type Page } from '@playwright/test';

/** Verify a later false breakpoint restores outside dates hidden at base. */
async function verifiesResponsiveOutsideDays({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/iframe.html?id=internal-datepicker-css-contract--responsive-outside');
  const outside = page
    .getByTestId('date-picker-css-days')
    .locator('[data-date-picker-table-cell-trigger][data-outside-range]')
    .first();
  await expect(outside).toHaveAttribute('data-hide-outside-days', 'true');
  await expect(outside).toHaveAttribute('data-hide-outside-days-md', 'false');
  await expect(outside).toHaveCSS('visibility', 'hidden');
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(outside).toHaveCSS('visibility', 'visible');
}

/** Verify each day stays centered under its weekday when the calendar is stretched wider. */
async function verifiesStretchedDayAlignment({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/iframe.html?id=internal-datepicker-css-contract--responsive-outside');
  const table = page.getByTestId('date-picker-css-days');
  await page.addStyleTag({ content: '[data-testid="date-picker-css-days"] { width: 600px; }' });
  const header = table.locator('thead th').first();
  const day = table.locator('tbody tr').nth(1).locator('td').first();
  const trigger = day.locator('[data-date-picker-table-cell-trigger]');

  /** Measure how far the day sits from the middle of its weekday column. */
  async function offset(): Promise<number> {
    const [column, cell, button] = await Promise.all([
      header.boundingBox(),
      day.boundingBox(),
      trigger.boundingBox(),
    ]);
    if (!column || !cell || !button) throw new Error('The calendar did not render.');
    // A cell no wider than its day would pass without any centering.
    expect(cell.width).toBeGreaterThan(button.width + 10);
    return Math.abs(button.x + button.width / 2 - (column.x + column.width / 2));
  }

  await expect.poll(offset).toBeLessThan(1);
}

test('DatePicker responsive outside-day choice can restore days', verifiesResponsiveOutsideDays);
test('DatePicker days stay under their weekdays when stretched', verifiesStretchedDayAlignment);
