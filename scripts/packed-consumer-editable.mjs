import { expect } from '@playwright/test';

/** Verify installed Editable editing, cancel, and native disabled state. */
export async function verifyPackedEditable(page) {
  const root = page.getByTestId('packed-editable-root');
  const preview = page.getByTestId('packed-editable-preview');
  const input = page.getByTestId('packed-editable-input');
  await expect(root).toHaveClass(/lui-editable__root/);
  await expect(input).toHaveJSProperty('type', 'text');
  await preview.hover();
  await expect(preview).toHaveCSS('background-color', 'rgb(30, 40, 90)');
  await page.getByTestId('packed-editable-edit').click();
  await expect(input).toBeVisible();
  await input.fill('Changed name');
  await page.getByTestId('packed-editable-save').click();
  await expect(preview).toHaveText('Changed name');
  await page.getByTestId('packed-editable-toggle').click();
  await expect(input).toBeDisabled();
}
