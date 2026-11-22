import { expect, test, type Page } from '@playwright/test';

test.use({ timezoneId: 'America/Los_Angeles' });

/** Open on input click and navigate with native month and year controls. */
async function verifiesInputNavigation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-quick-guide--input-navigation');
  const input = page.getByTestId('date-picker-click-input');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await input.click();
  const grid = page.getByTestId('date-picker-click-days');
  await expect(grid).toBeVisible();
  await page.getByTestId('date-picker-month-select').selectOption({ label: 'April' });
  await page.getByTestId('date-picker-year-select').selectOption({ label: '2027' });
  await expect(grid.locator('td[data-value^="2027-04-"]').first()).toBeVisible();
}

test('DatePicker opens on input click and follows month and year selects', verifiesInputNavigation);

/** Select the machine's UTC day from the footer without clock-dependent dates. */
async function verifiesTodayAction({ page }: { page: Page }): Promise<void> {
  await page.clock.setFixedTime(new Date('2026-03-14T01:30:00.000Z'));
  await page.goto('/iframe.html?id=components-datepicker-quick-guide--today');
  expect(
    await page.evaluate(
      /** Confirm this instant falls on the previous local calendar day. */
      () => new Date().getDate(),
    ),
  ).toBe(13);
  await expect(page.getByRole('button', { name: 'Today' })).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Today' }).click();
  await expect(page.getByTestId('date-picker-today-value')).toHaveText('2026-03-14');
  await expect(page.getByTestId('date-picker-today-input')).not.toHaveValue('');
}

test('DatePicker selects the current day from a custom footer', verifiesTodayAction);

/** Bridge Field invalid state and IDs into the wrapped date input. */
async function verifiesFieldIntegration({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-quick-guide--field-integration');
  const input = page.getByTestId('date-picker-field-input');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('button', { name: 'Toggle invalid' }).click();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  const inputId = await input.getAttribute('id');
  await expect(page.getByText('Date of birth', { exact: true })).toHaveAttribute(
    'for',
    inputId ?? '',
  );
  await expect(page.getByText('Date of birth is required')).toBeVisible();
  const errorId = await page.getByText('Date of birth is required').getAttribute('id');
  await expect(input).toHaveAttribute('aria-describedby', errorId ?? '');
  await page.getByRole('button', { name: 'Toggle invalid' }).click();
  await expect(input).not.toHaveAttribute('aria-describedby', errorId ?? '');
}

test(
  'DatePicker inherits Field label and invalid state through explicit wiring',
  verifiesFieldIntegration,
);

/** Keep the adorned input selectable and clearable inside InputGroup. */
async function verifiesAdornedPicker({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-quick-guide--adorned');
  const input = page.getByTestId('date-picker-grouped-input');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(input).toHaveClass(/leverui-input-group__field/);
  await expect(input).toHaveCSS('padding-inline-start', '40px');
  await expect(input).toHaveCSS('padding-inline-end', '40px');
  await page.getByRole('button', { name: 'Open adorned calendar' }).click();
  const grid = page.getByTestId('date-picker-grouped-days');
  await expect(grid).toBeVisible();
  await grid.locator('td[data-value="2026-03-14"] [data-date-picker-table-cell-trigger]').click();
  await expect(input).toHaveValue('03/14/2026');
  await page.getByRole('button', { name: 'Clear adorned date' }).click();
  await expect(input).toHaveValue('');
}

test('DatePicker composes with InputGroup adornments and ClearTrigger', verifiesAdornedPicker);
