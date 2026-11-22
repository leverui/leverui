import { expect, test, type Page } from '@playwright/test';

/** Verify manual table columns stay in Zag without changing CSS columns. */
async function verifiesManualGrid({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-composition--manual');
  const table = page.getByTestId('date-picker-manual-table');
  await expect(table).toBeVisible({ timeout: 30_000 });
  await expect(table).toHaveAttribute('data-columns', '4');
  await expect(table.locator('[data-date-picker-table-cell]')).toHaveCount(12);
  const cell = table.locator('[data-date-picker-table-cell]').first();
  await expect(cell).toHaveAttribute('colspan', '4');
  expect(await table.evaluate(readColumnCount)).toBe('auto');
  expect(await cell.evaluate(readColumnCount)).toBe('auto');
  const range = page.getByTestId('date-picker-manual-range');
  await expect(range).toHaveJSProperty('tagName', 'DIV');
  await expect(range).toHaveAttribute('data-range-ref', 'DIV');
}

/** Read the CSS property that previously consumed the machine column count. */
function readColumnCount(element: Element): string {
  return getComputedStyle(element).columnCount;
}

test('DatePicker keeps table columns out of CSS and types RangeText as a div', verifiesManualGrid);

/** Verify caller-owned machines retain child refs and reactive appearance defaults. */
async function verifiesExternalMachine({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-composition--external');
  const root = page.getByTestId('date-picker-external-root');
  const input = page.getByTestId('date-picker-external-input');
  await expect(root).toHaveAttribute('data-root-ref', 'attached', { timeout: 30_000 });
  await expect(root).toHaveJSProperty('tagName', 'SECTION');
  await expect(input).toHaveAttribute('translate', 'no');
  await expect(input).toHaveValue('03/14/2026');
  await expect(page.getByTestId('date-picker-external-value')).toContainText('3/14/2026');
  const before = await input.evaluate(readHeight);
  await page.getByRole('button', { name: 'Increase picker size' }).click();
  const after = await input.evaluate(readHeight);
  expect(after).toBeGreaterThan(before);
  await expect(input).toHaveValue('03/14/2026');
}

/** Measure the visible input rather than its generated class name. */
function readHeight(element: Element): number {
  return element.getBoundingClientRect().height;
}

test(
  'DatePicker RootProvider preserves external state and reactive styling',
  verifiesExternalMachine,
);
