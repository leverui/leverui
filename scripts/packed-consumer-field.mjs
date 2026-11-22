import assert from 'node:assert/strict';
import { expect } from '@playwright/test';

/** Verify installed Field parts, accessible association, and consumer CSS. */
export async function verifyPackedField(page) {
  const root = page.getByTestId('packed-field-root');
  const label = page.getByTestId('packed-field-label');
  const input = page.getByTestId('packed-field-input');
  await expect(root).toHaveClass(/leverui-field__root/);
  await expect(root).toHaveCSS('flex-direction', 'column');
  await expect(label).toHaveAttribute('for', 'packed-email');
  await expect(input).toHaveAttribute('required', '');
  await expect(input).toHaveCSS('border-radius', '13px');
  const addon = page.getByTestId('packed-input-addon');
  await expect(addon).toHaveClass(/leverui-input-addon/);
  await expect(addon).toHaveText('https://');
  await expect(addon).toHaveCSS('border-radius', '15px');
  const element = page.getByTestId('packed-input-element');
  await expect(element).toHaveClass(/leverui-input-element/);
  await expect(element).toHaveText('kg');
  await expect(element).toHaveCSS('color', 'rgb(10, 80, 170)');
  const group = page.getByTestId('packed-input-group');
  const groupedInput = page.getByTestId('packed-input-group-field');
  await expect(group).toHaveClass(/leverui-input-group/);
  await expect(group).toHaveCSS('outline-color', 'rgb(10, 80, 170)');
  await expect(groupedInput).toHaveClass(/leverui-input/);
  await expect(input).toHaveAttribute('aria-describedby', /helper-text/);
  await page.getByTestId('packed-field-validate').click();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAttribute('aria-describedby', /error-text/);
  const error = page.getByText('Packed error');
  await expect(error).toBeVisible();
  assert.equal(
    await error.evaluate(
      /** Read the consumer stylesheet's Field error override. */
      (element) => getComputedStyle(element).color,
    ),
    'rgb(128, 40, 120)',
  );
}
