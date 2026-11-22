import { expect, test, type Page } from '@playwright/test';

/** Check the machine constrains an out-of-range initial value. */
async function verifiesDateLimits({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput-guide--constraints');
  const segments = page.getByTestId('date-input-constraints-segments');
  const hidden = page.getByTestId('date-input-constraints-hidden');
  await expect(hidden).toHaveValue('3/14/2026', { timeout: 30_000 });
  await expect(segments.locator('[data-type="year"]')).toHaveAttribute('aria-valuenow', '2026');
  await expect(page.getByTestId('date-input-maximum-hidden')).toHaveValue('11/30/2026');
  await expect(
    page.getByTestId('date-input-maximum-segments').locator('[data-type="year"]'),
  ).toHaveAttribute('aria-valuenow', '2026');
}

test('DateInput constrains its initial value to date limits', verifiesDateLimits);

/** Check the machine uses the requested German order and form format. */
async function verifiesLocale({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput-guide--locale');
  const segments = page.getByTestId('date-input-locale-segments');
  await expect(segments.getByRole('spinbutton')).toHaveCount(3, { timeout: 30_000 });
  await expect(segments.getByRole('spinbutton').first()).toHaveAttribute('data-type', 'day');
  await expect(page.getByTestId('date-input-locale-hidden')).toHaveValue(/14\.3\.2026/);
}

test('DateInput formats German day-first dates', verifiesLocale);

/** Check minute-only editing omits calendar fields and updates the form. */
async function verifiesTimeOnly({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput-guide--time-only');
  const segments = page.getByTestId('date-input-time-segments');
  const hidden = page.getByTestId('date-input-time-hidden');
  await expect(segments).toBeVisible({ timeout: 30_000 });
  await expect(segments.locator('[data-type="month"]')).toHaveCount(0);
  await expect(hidden).toHaveValue(/8:45 AM/);
  const minute = segments.locator('[data-type="minute"]');
  await minute.focus();
  await minute.press('ArrowUp');
  await expect(hidden).toHaveValue(/8:46 AM/);
}

test('DateInput edits a time-only minute value', verifiesTimeOnly);

/** Check forced zero padding changes visible segments without altering the date. */
async function verifiesLeadingZeros({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput-guide--leading-zeros');
  const segments = page.getByTestId('date-input-zeros-segments');
  await expect(segments.locator('[data-type="month"]')).toHaveText('01', { timeout: 30_000 });
  await expect(segments.locator('[data-type="day"]')).toHaveText('05');
  await expect(page.getByTestId('date-input-zeros-hidden')).toHaveValue('01/05/2026');
}

test('DateInput displays requested leading zeros', verifiesLeadingZeros);

/** Check the public locale provider supplies right-to-left direction. */
async function verifiesRtl({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput-guide--rtl');
  const segments = page.getByTestId('date-input-rtl-segments');
  await expect(segments).toHaveAttribute('dir', 'rtl', { timeout: 30_000 });
  await expect(segments.getByRole('spinbutton')).toHaveCount(3);
  await expect(page.getByTestId('date-input-rtl-hidden')).not.toHaveValue('');
}

test('DateInput follows a right-to-left locale', verifiesRtl);
