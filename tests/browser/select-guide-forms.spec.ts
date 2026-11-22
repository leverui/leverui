import { expect, test, type Page } from '@playwright/test';
import { selectGuideFormValue } from './select-guide-form-value';

/** Verify uncontrolled Select values reach a real form submit handler. */
async function verifiesNativeForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-guide-forms--native');
  const trigger = page.getByTestId('select-native-guide-trigger');
  const form = page.getByTestId('select-native-guide-form');
  await expect(trigger).toHaveAccessibleName('Framework', { timeout: 30_000 });
  await trigger.click();
  await page.getByRole('option', { name: 'Vue.js' }).click();
  expect(await form.evaluate(selectGuideFormValue, 'framework')).toBe('vue');
  await form.getByRole('button', { name: 'Submit native form' }).click();
  await expect(page.getByTestId('select-native-guide-result')).toHaveText('vue');
}

test('Select submits its uncontrolled value through a native form', verifiesNativeForm);

/** Verify a Solid controlled form validates and submits the selected value. */
async function verifiesControlledForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-guide-forms--controlled');
  const form = page.getByTestId('select-controlled-guide-form');
  const trigger = page.getByTestId('select-controlled-guide-trigger');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(form).toHaveAttribute('data-touched', 'false');
  await trigger.click();
  await expect(page.getByRole('option', { name: 'Angular' })).toBeVisible();
  await page.locator('body').click({ position: { x: 4, y: 4 } });
  await expect(form).toHaveAttribute('data-touched', 'true');
  expect(await form.evaluate(selectGuideFormValue, 'framework')).toBeNull();
  await form.getByRole('button', { name: 'Submit controlled form' }).click();
  await expect(form.getByText('Framework is required')).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-invalid', 'true');
  await trigger.click();
  await page.getByRole('option', { name: 'Angular' }).click();
  await expect(form.getByText('Framework is required')).not.toBeVisible();
  expect(await form.evaluate(selectGuideFormValue, 'framework')).toBe('angular');
  await form.getByRole('button', { name: 'Submit controlled form' }).click();
  await expect(page.getByTestId('select-controlled-guide-result')).toHaveText('angular');
}

test('Select integrates with a validated Solid controlled form', verifiesControlledForm);
