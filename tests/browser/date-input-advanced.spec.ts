import { expect, test, type Page } from '@playwright/test';

/** Check timezone presentation without changing the underlying date. */
async function verifiesZonedDate({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput-advanced--zoned');
  const segments = page.getByTestId('date-input-zoned-segments');
  const hidden = page.getByTestId('date-input-zoned-hidden');
  await expect(segments).toBeVisible({ timeout: 30_000 });
  await expect(segments.getByRole('spinbutton')).toHaveCount(7);
  await expect(segments.locator('[data-type="timeZoneName"]')).toHaveCount(1);
  await expect(hidden).toHaveValue('3/14/2026, 8:45 AM PDT');
  await page.getByRole('button', { name: 'Toggle time zone' }).click();
  await expect(segments.locator('[data-type="timeZoneName"]')).toHaveCount(0);
  await expect(hidden).toHaveValue('3/14/2026, 8:45 AM');
}

test('DateInput changes timezone presentation reactively', verifiesZonedDate);

/** Check appearance defaults update owned and externally supplied machines. */
async function verifiesProvider({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput-advanced--provider');
  const owned = page.getByTestId('date-input-owned-segments');
  const provided = page.getByTestId('date-input-provider-segments');
  await expect(owned.getByRole('spinbutton')).toHaveCount(3, { timeout: 30_000 });
  await expect(provided.getByRole('spinbutton')).toHaveCount(3);
  const initialHeight = await owned.evaluate(
    /** Read the current visual size from the rendered segment group. */
    (element) => getComputedStyle(element).height,
  );
  await page.getByRole('button', { name: 'Increase date size' }).click();
  await expect(owned).toHaveCSS('height', /.+/);
  const nextHeight = await owned.evaluate(
    /** Read the new visual size after the reactive appearance update. */
    (element) => getComputedStyle(element).height,
  );
  expect(nextHeight).not.toBe(initialHeight);
  await expect(provided).toHaveCSS('height', nextHeight);
}

test('DateInput keeps provider defaults reactive for both roots', verifiesProvider);
