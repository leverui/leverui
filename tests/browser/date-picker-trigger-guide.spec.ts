import { expect, test, type Page } from '@playwright/test';

/** Keep the primitive's open, focus, ref, and value behavior on the custom button. */
async function verifiesButtonTrigger({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-trigger-guide--button-trigger');
  const trigger = page.getByTestId('date-picker-button-trigger');
  await expect(trigger).toHaveClass(/lui-button/, { timeout: 30_000 });
  await expect(trigger).toHaveAttribute('data-trigger-ref', 'BUTTON');
  await trigger.click();
  const content = page.getByTestId('date-picker-trigger-content');
  await expect(content).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page
    .getByTestId('date-picker-trigger-days')
    .locator('td[data-value="2026-03-14"] [data-date-picker-table-cell-trigger]')
    .click();
  await expect(trigger).toContainText('03/14/2026');
}

test('DatePicker custom Button retains machine events and focus', verifiesButtonTrigger);

/** Keep a separate icon trigger operable beside the native date input. */
async function verifiesOutsideIcon({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-trigger-guide--outside-icon');
  const input = page.getByTestId('date-picker-outside-input');
  const trigger = page.getByTestId('date-picker-outside-trigger');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(trigger).toHaveAttribute('data-trigger-ref', 'BUTTON');
  await trigger.click();
  await expect(page.getByTestId('date-picker-trigger-days')).toBeVisible();
  await page
    .getByTestId('date-picker-trigger-days')
    .locator('td[data-value="2026-03-15"] [data-date-picker-table-cell-trigger]')
    .click();
  await expect(input).toHaveValue('03/15/2026');
}

test('DatePicker outside icon trigger selects into its adjacent input', verifiesOutsideIcon);
