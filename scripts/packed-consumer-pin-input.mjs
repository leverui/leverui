import { expect } from '@playwright/test';

/** Verify the installed Pin Input machine and plain CSS override. */
export async function verifyPackedPinInput(page) {
  const first = page.getByTestId('packed-pin-0');
  const second = page.getByTestId('packed-pin-1');
  await expect(first).toHaveClass(/lui-pin-input__input/);
  await expect(first).toHaveAttribute('type', 'password');
  await expect(first).toHaveCSS('border-radius', '12px');
  await first.fill('1');
  await expect(second).toBeFocused();
  await second.fill('2');
  await page.getByTestId('packed-pin-2').fill('3');
  await page.getByTestId('packed-pin-3').fill('4');
  await expect(page.locator('.packed-pin-input input[name="code"]')).toHaveValue('1234');
}
