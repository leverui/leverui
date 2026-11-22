import { expect } from '@playwright/test';

/** Verify the packed Number Input's machine and plain CSS override. */
export async function verifyPackedNumberInput(page) {
  const input = page.getByTestId('packed-number-input');
  const increment = page.getByTestId('packed-number-increment');
  // Zag 2 renders a text field described as a number field, not a spinbutton.
  await expect(input).toHaveAttribute('aria-roledescription', 'number field');
  await expect(input).toHaveValue('2');
  await expect(input).toHaveCSS('border-radius', '12px');
  await increment.click();
  await expect(input).toHaveValue('4');
  await expect(increment).toBeDisabled();
  await page.evaluate(
    /** Let Zag finish cursor work before the next component receives focus. */
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(
          /** Cross Zag's first cursor synchronization frame. */
          () => requestAnimationFrame(resolve),
        );
      }),
  );
}
