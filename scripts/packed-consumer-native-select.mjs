import { expect } from '@playwright/test';

/** Verify the packed Native Select remains native and honors plain CSS. */
export async function verifyPackedNativeSelect(page) {
  const select = page.getByTestId('packed-select');
  await expect(select).toHaveAttribute('required', '');
  await expect(select).toHaveCSS('border-radius', '11px');
  await expect(select).toHaveValue('ca');
  await select.selectOption('us');
  await expect(select).toHaveValue('us');
  await page.getByTestId('packed-select-validate').click();
  await expect(select).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('packed-select-indicator')).toHaveAttribute('data-invalid', '');
}
