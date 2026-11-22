import { expect, test, type Page } from '@playwright/test';

/** Open the basic picker through its native keyboard trigger. */
async function verifiesBasicPicker({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-colorpicker--basic');
  const input = page.getByTestId('color-picker-input');
  const trigger = page.getByTestId('color-picker-trigger');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(input).toHaveValue('#EB5E41');
  await expect(trigger).toHaveClass(/leverui-color-picker__trigger/);
  await expect(page.getByTestId('color-picker-hidden')).toHaveAttribute('tabindex', '-1');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('color-picker-content')).toBeVisible();
  await expect(page.getByTestId('color-picker-area')).toHaveClass(/leverui-color-picker__area/);
  await expect(page.getByRole('slider')).toHaveCount(3);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('color-picker-content')).toBeHidden();
}

test('ColorPicker opens its complete area with keyboard input', verifiesBasicPicker);

/** Keep the Solid-owned color reactive when a preset swatch is selected. */
async function verifiesControlledSwatch({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-colorpicker--controlled');
  const input = page.getByTestId('color-picker-controlled-input');
  await expect(input).toHaveValue('#FF0000', { timeout: 30_000 });
  await page.getByTestId('color-picker-controlled-trigger').click();
  await page.getByRole('button', { name: 'Blue color' }).click();
  await expect(input).toHaveValue('#0000FF');
  await expect(page.getByTestId('color-picker-controlled-value')).toContainText('0, 0, 255');
}

test('ColorPicker updates its controlled value from a swatch', verifiesControlledSwatch);

/** Keep disabled controls out of the interaction path. */
async function verifiesDisabledPicker({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-colorpicker--disabled');
  const input = page.getByTestId('color-picker-disabled-input');
  const trigger = page.getByTestId('color-picker-disabled-trigger');
  await expect(input).toBeDisabled({ timeout: 30_000 });
  await expect(trigger).toBeDisabled();
}

test('ColorPicker forwards disabled state to native controls', verifiesDisabledPicker);

/** Preserve the caller's the primitive machine under a styled RootProvider. */
async function verifiesProviderMachine({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-colorpicker--provider');
  const input = page.getByTestId('color-picker-provider-input');
  await expect(input).toHaveValue('#336699', { timeout: 30_000 });
  await page.getByTestId('color-picker-provider-trigger').click();
  await expect(page.getByTestId('color-picker-provider-content')).toBeVisible();
}

test('ColorPicker RootProvider retains a caller-owned machine', verifiesProviderMachine);
