import { expect, test, type Page } from '@playwright/test';
import { scanWcagViolations } from './axe-scan';

/** Check machine restrictions through the wrapped day cells. */
async function verifiesConstrainedDays({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-state--constrained');
  const grid = page.getByTestId('date-picker-state-days');
  await expect(grid).toBeVisible({ timeout: 30_000 });
  await expect(grid.locator('td[data-value="2026-03-09"]')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(grid.locator('td[data-value="2026-03-14"]')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(
    grid.locator('[data-date-picker-table-cell-trigger][data-value="2026-03-14"]'),
  ).toHaveAttribute('data-unavailable', '');
  await expect(grid.locator('td[data-value="2026-03-20"]')).not.toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(grid.locator('td[data-value="2026-03-21"]')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
}

test('DatePicker preserves min, max, and unavailable date rules', verifiesConstrainedDays);

/** Verify disabled and read-only roots prevent date editing. */
async function verifiesInertStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-state--inert');
  const disabled = page.getByTestId('date-picker-disabled-input');
  const readOnly = page.getByTestId('date-picker-readonly-input');
  await expect(disabled).toBeDisabled({ timeout: 30_000 });
  await expect(page.getByRole('button', { name: 'Open disabled calendar' })).toBeDisabled();
  await expect(readOnly).toHaveAttribute('readonly');
  await page
    .getByTestId('date-picker-readonly-days')
    .locator('[data-value="2026-03-14"] [data-date-picker-table-cell-trigger]')
    .click({ force: true });
  await expect(readOnly).toHaveValue('');
}

test('DatePicker keeps disabled and read-only controls inert', verifiesInertStates);

/** Verify externally controlled open and view changes reach calendar parts. */
async function verifiesControlledView({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-state--controlled');
  await expect(page.getByTestId('date-picker-controlled-state')).toHaveText('false day', {
    timeout: 30_000,
  });
  await page.getByRole('button', { name: 'Open externally' }).click();
  await expect(page.getByTestId('date-picker-state-days')).toBeVisible();
  await page.getByRole('button', { name: 'Show year externally' }).click();
  await expect(page.getByTestId('date-picker-state-years')).toBeVisible();
  await expect(page.getByTestId('date-picker-controlled-state')).toHaveText('true year');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('date-picker-controlled-state')).toHaveText('false year');
}

test('DatePicker responds to controlled open and view signals', verifiesControlledView);

/** Confirm offset tables cover successive months and preset state is selectable. */
async function verifiesMultiMonthPreset({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-state--multi-month');
  const first = page.getByTestId('date-picker-first-month');
  const second = page.getByTestId('date-picker-second-month');
  await expect(first).toBeVisible({ timeout: 30_000 });
  await expect(second).toBeVisible();
  await expect(first.locator('[data-value^="2026-03-"]')).not.toHaveCount(0);
  await expect(second.locator('[data-value^="2026-04-"]')).not.toHaveCount(0);
  await page.getByText('This month', { exact: true }).click();
  await expect(page.getByTestId('date-picker-preset-value')).toHaveText(/^2:/);
}

test('DatePicker renders multiple months and applies a range preset', verifiesMultiMonthPreset);

/** Scan the assembled picker and open popup for common WCAG failures. */
async function verifiesAccessibility({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker--basic');
  await page.getByRole('button', { name: 'Open calendar' }).click();
  await expect(page.getByTestId('date-picker-days')).toBeVisible();
  await expect(page.getByTestId('date-picker-content')).toHaveCSS('opacity', '1');
  const violations = await scanWcagViolations(page);
  expect(violations).toEqual([]);
}

test('DatePicker has no common WCAG A or AA violations', verifiesAccessibility);
