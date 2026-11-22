import { expect, test, type Page } from '@playwright/test';
import { sliderGuideFormValue } from './slider-guide-form-value';

/** Verify the Solid form controller receives blur, validation, and native values. */
async function verifiesControlledSliderForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-guide-form--controlled');
  const form = page.getByTestId('slider-controlled-guide-form');
  const thumb = form.getByRole('slider', { name: /Slider:/ });
  await expect(thumb).toHaveAttribute('aria-valuenow', '40', { timeout: 30_000 });
  await expect(form).toHaveAttribute('data-touched', 'false');
  await thumb.focus();
  await thumb.press('Tab');
  await expect(form).toHaveAttribute('data-touched', 'true');
  await form.getByRole('button', { name: 'Submit value' }).click();
  await expect(form.getByText('Value must be at least 60')).toBeVisible();
  await expect(thumb).toHaveAttribute('aria-invalid', 'true');
  await expect(thumb).toHaveAccessibleDescription('Value must be at least 60');
  await thumb.focus();
  await thumb.press('End');
  await expect(thumb).toHaveAttribute('aria-valuenow', '100');
  await expect(form.getByText('Value must be at least 60')).not.toBeVisible();
  await expect(thumb).not.toHaveAttribute('aria-invalid', 'true');
  await expect(thumb).not.toHaveAttribute('aria-describedby', /.+/);
  expect(await form.evaluate(sliderGuideFormValue, 'value')).toBe('100');
  await form.getByRole('button', { name: 'Submit value' }).click();
  await expect(page.getByTestId('slider-controlled-guide-result')).toHaveText('100');
}

test('Slider integrates with a controlled Solid form', verifiesControlledSliderForm);
