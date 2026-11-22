import { expect, test, type Page } from '@playwright/test';

/** Verify the labeled field opens a navigable and selectable day grid. */
async function verifiesBasicPicker({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker--basic');
  const input = page.getByTestId('date-picker-input');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(input).toHaveClass(/leverui-date-picker__input/);
  await page.getByRole('button', { name: 'Open calendar' }).click();
  await expect(page.getByTestId('date-picker-content')).toBeVisible();
  await expect(page.getByTestId('date-picker-days')).toBeVisible();
  await page
    .getByTestId('date-picker-days')
    .locator('[data-date-picker-table-cell-trigger]', { hasText: /^14$/ })
    .first()
    .click();
  await expect(input).toHaveValue(/3\/14\/2026/);
  await page.getByRole('button', { name: 'Clear date' }).click();
  await expect(input).toHaveValue('');
}

test('DatePicker selects and clears a date through its calendar', verifiesBasicPicker);

/** Verify the composed grid renders localized week-number cells. */
async function verifiesWeekNumbers({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker--week-numbers');
  const grid = page.getByTestId('date-picker-week-days');
  await expect(grid).toBeVisible({ timeout: 30_000 });
  await expect(grid.locator('th[data-type="week-number"]')).toHaveCount(1);
  await expect(grid.locator('td[data-type="week-number"]').first()).toBeVisible();
  await expect(grid.locator('th').filter({ hasText: 'M' }).first()).toBeVisible();
}

test('DatePicker shows week numbers in a localized day table', verifiesWeekNumbers);

/** Verify external Solid state updates both range inputs. */
async function verifiesControlledRange({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker--controlled-range');
  const start = page.getByTestId('date-picker-range-start');
  const end = page.getByTestId('date-picker-range-end');
  await expect(start).toHaveValue('03/14/2026', { timeout: 30_000 });
  await expect(end).toHaveValue('03/20/2026');
  await page.getByRole('button', { name: 'Set next range' }).click();
  await expect(start).toHaveValue('04/05/2026');
  await expect(end).toHaveValue('04/12/2026');
  await expect(page.getByTestId('date-picker-range-value')).toHaveText('2026-04-05, 2026-04-12');
}

test('DatePicker responds to externally controlled range values', verifiesControlledRange);

/** Verify root-scope public variables reach the field and portalled calendar. */
async function verifiesPublicVariableOverride({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker--basic');
  await page.addStyleTag({ content: ':root { --leverui-date-picker-radius: 17px; }' });
  const input = page.getByTestId('date-picker-input');
  await expect(input).toBeVisible({ timeout: 30_000 });
  expect(await input.evaluate(readRadius)).toBe('17px');
  await page.getByRole('button', { name: 'Open calendar' }).click();
  const content = page.getByTestId('date-picker-content');
  await expect(content).toBeVisible();
  expect(await content.evaluate(readRadius)).toBe('17px');
}

/** Read the rendered corner radius after CSS variable resolution. */
function readRadius(element: Element): string {
  return getComputedStyle(element).borderTopLeftRadius;
}

test('DatePicker honors root-scope CSS variables in a portal', verifiesPublicVariableOverride);
