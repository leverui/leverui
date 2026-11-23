import assert from 'node:assert/strict';
import { expect } from '@playwright/test';

/** Verify installed Fieldset grouping, state, and CSS customization. */
export async function verifyPackedFieldset(page) {
  const root = page.getByTestId('packed-fieldset-root');
  const legend = page.getByTestId('packed-fieldset-legend');
  const input = page.getByTestId('packed-fieldset-input');
  await expect(root).toHaveClass(/lui-fieldset__root/);
  await expect(root).toHaveAttribute('aria-labelledby', /fieldset::packed-contact::legend/);
  await expect(root).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(legend).toHaveCSS('font-size', '14px');
  await expect(input).toBeEnabled();
  await page.getByTestId('packed-fieldset-toggle').click();
  await expect(input).toBeDisabled();
  await expect(root).toHaveAttribute('aria-describedby', /error-text/);
  const error = page.getByText('Contact error');
  await expect(error).toBeVisible();
  assert.equal(
    await error.evaluate(
      /** Read the installed consumer stylesheet's error token override. */
      (element) => getComputedStyle(element).color,
    ),
    'rgb(90, 30, 170)',
  );
}
