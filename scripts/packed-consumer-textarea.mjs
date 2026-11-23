import { expect } from '@playwright/test';

/** Check installed Textarea editing, Field association, and plain CSS. */
export async function verifyPackedTextarea(page) {
  const control = page.getByTestId('packed-textarea');
  await expect(control).toHaveClass(/lui-textarea/);
  await expect(control).toHaveAttribute('id', 'packed-notes');
  await expect(control).toHaveAttribute('required', '');
  await expect(control).toHaveValue('Packed notes');
  await expect(control).toHaveCSS('border-radius', '14px');
  await control.fill('Updated notes');
  await expect(control).toHaveValue('Updated notes');
}
