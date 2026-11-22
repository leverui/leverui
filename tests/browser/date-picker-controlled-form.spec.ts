import { expect, test, type Page } from '@playwright/test';

/** Require a date and submit both controller and native form values. */
async function verifiesControlledForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-controlled-form--basic');
  const input = page.getByTestId('date-picker-controlled-form-input');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Submit reservation' }).click();
  expect(
    await input.evaluate(
      /** Read the native constraint state after the blocked submission. */
      (element: HTMLInputElement) => element.validity.valueMissing,
    ),
  ).toBe(true);
  await expect(page.getByTestId('date-picker-controlled-form-result')).toHaveText('');
  await page.getByRole('button', { name: 'Open reservation calendar' }).click();
  await page
    .getByTestId('date-picker-controlled-form-days')
    .locator('td[data-value="2026-03-14"] [data-date-picker-table-cell-trigger]')
    .click();
  await expect(input).toHaveValue('03/14/2026');
  await page.getByRole('button', { name: 'Submit reservation' }).click();
  await expect(page.getByTestId('date-picker-controlled-form-result')).toHaveText(
    '2026-03-14|03/14/2026',
  );
}

test('DatePicker controlled form preserves validation and FormData', verifiesControlledForm);
