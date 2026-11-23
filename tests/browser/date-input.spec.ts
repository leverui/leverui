import { expect, test, type Page } from '@playwright/test';

/** Check the segmented editor, label, stable classes, and native form value. */
async function verifiesBasicDate({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput--basic');
  const segments = page.getByTestId('date-input-basic-segments');
  await expect(segments).toBeVisible({ timeout: 30_000 });
  await expect(segments).toHaveClass(/lui-date-input__segmentGroup/);
  await expect(segments.getByRole('spinbutton')).toHaveCount(3);
  await expect(page.getByTestId('date-input-basic-hidden')).toHaveValue('3/14/2026');
  await page.getByText('Date of birth').click();
  await expect(segments.getByRole('spinbutton').first()).toBeFocused();
}

test('DateInput exposes labeled date segments and a native value', verifiesBasicDate);

/** Check that a caller-owned signal updates the live machine and form input. */
async function verifiesControlledDate({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput--controlled');
  const hidden = page.getByTestId('date-input-controlled-hidden');
  await expect(hidden).toHaveValue('3/14/2026', { timeout: 30_000 });
  await page.getByRole('button', { name: 'Set next date' }).click();
  await expect(hidden).toHaveValue('4/5/2026');
  await expect(page.getByTestId('date-input-controlled-value')).toHaveText('2026-04-05');
}

test('DateInput responds to external controlled values', verifiesControlledDate);

/** Check keyboard editing updates the caller's signal through onValueChange. */
async function verifiesControlledKeyboardEdit({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput--controlled');
  const segments = page.getByTestId('date-input-controlled-segments');
  const day = segments.locator('[data-type="day"]');
  await expect(day).toHaveAttribute('aria-valuenow', '14', { timeout: 30_000 });
  await day.focus();
  await day.press('ArrowUp');
  await expect(page.getByTestId('date-input-controlled-hidden')).toHaveValue('3/15/2026');
  await expect(page.getByTestId('date-input-controlled-value')).toHaveText('2026-03-15');
}

test(
  'DateInput reports keyboard edits to a controlled Solid signal',
  verifiesControlledKeyboardEdit,
);

/** Check that range indices retain distinct visible and native dates. */
async function verifiesRange({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput--range');
  await expect(page.getByTestId('date-input-range-start').getByRole('spinbutton')).toHaveCount(3);
  await expect(page.getByTestId('date-input-range-end').getByRole('spinbutton')).toHaveCount(3);
  await expect(page.getByTestId('date-input-range-hidden-start')).toHaveValue('3/14/2026');
  await expect(page.getByTestId('date-input-range-hidden-end')).toHaveValue('3/20/2026');
}

test('DateInput indexes both values in a date range', verifiesRange);

/** Check machine states reach each interactive segment. */
async function verifiesStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput--states');
  const disabled = page.getByTestId('date-input-disabled-segments');
  const invalid = page.getByTestId('date-input-invalid-segments');
  const readonly = page.getByTestId('date-input-readonly-segments');
  await expect(disabled.getByRole('spinbutton').first()).toHaveAttribute('aria-disabled', 'true');
  await expect(invalid.getByRole('spinbutton').first()).toHaveAttribute('aria-invalid', 'true');
  await expect(readonly.getByRole('spinbutton').first()).toHaveAttribute('aria-readonly', 'true');
}

test('DateInput forwards disabled, invalid, and read-only state', verifiesStates);
