import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'alphanumeric',
  'attached',
  'basic',
  'controlled',
  'with-field',
  'with-separator',
  'with-hook-form',
  'with-mask',
  'with-otp',
  'with-placeholder',
  'sizes',
  'with-store',
  'auto-submit',
  'sanitized-value',
] as const;

/** Open one curated Pin Input story. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-pininput--${id}`);
}

/** Require each story to render its indexed native fields. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await openStory(page, id);
    await expect(page.locator('[data-pin-input-input]').first()).toBeVisible();
  }
}

/** Check numeric and alphanumeric entry, focus movement, and controlled state. */
async function verifiesEntry({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  const digits = page.locator('[data-pin-input-input]');
  await expect(digits).toHaveCount(4);
  await digits.nth(0).fill('1');
  await expect(digits.nth(1)).toBeFocused();
  await digits.nth(1).fill('2');
  await expect(digits.nth(1)).toHaveValue('2');

  await openStory(page, 'alphanumeric');
  const letters = page.locator('[data-pin-input-input]');
  await letters.nth(0).fill('a');
  await expect(letters.nth(0)).toHaveValue('a');

  await openStory(page, 'controlled');
  const controlled = page.locator('[data-pin-input-input]');
  await controlled.nth(0).fill('4');
  await expect(controlled.nth(0)).toHaveValue('4');
  await expect(controlled.nth(1)).toBeFocused();
}

/** Check masks, OTP metadata, placeholder copy, and six field layout. */
async function verifiesOptions({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'with-mask');
  await expect(page.locator('[data-pin-input-input]').first()).toHaveAttribute('type', 'password');
  await openStory(page, 'with-otp');
  await expect(page.locator('[data-pin-input-input]').first()).toHaveAttribute(
    'autocomplete',
    'one-time-code',
  );
  await openStory(page, 'with-placeholder');
  await expect(page.locator('[data-pin-input-input]').first()).toHaveAttribute('placeholder', '🥳');
  await openStory(page, 'with-separator');
  await expect(page.locator('[data-pin-input-input]')).toHaveCount(6);
  await expect(page.getByText('–')).toBeVisible();
  await openStory(page, 'sizes');
  await expect(page.locator('[data-pin-input-input]')).toHaveCount(12);
  await openStory(page, 'attached');
  await expect(page.locator('[data-pin-input-input]')).toHaveCount(4);
}

/** Exercise external set and clear actions plus native auto-submit. */
async function verifiesExternalState({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'with-store');
  const fields = page.locator('[data-pin-input-input]');
  await page.getByRole('button', { name: 'Set value' }).click();
  await expect(fields.nth(0)).toHaveValue('1');
  await expect(fields.nth(3)).toHaveValue('4');
  await page.getByRole('button', { name: 'Clear value' }).click();
  await expect(fields.nth(0)).toHaveValue('');

  await openStory(page, 'auto-submit');
  const auto = page.locator('[data-pin-input-input]');
  for (const [index, value] of ['1', '2', '3', '4'].entries()) {
    await auto.nth(index).fill(value);
  }
  await expect(page.getByText('The form was submitted.')).toBeVisible();
}

/** Check Field labeling, form validation, and sanitized paste. */
async function verifiesIntegrations({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'with-field');
  await expect(page.getByText('Enter the one-time code')).toBeVisible();

  await openStory(page, 'with-hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Enter all 4 digits.')).toBeVisible();
  const formFields = page.locator('[data-pin-input-input]');
  await formFields.nth(0).fill('1');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Enter all 4 digits.')).toHaveCount(0);
  await expect(page.locator('[data-field-root]')).toHaveAttribute('data-invalid');
  for (const [index, value] of ['2', '3', '4'].entries()) {
    await formFields.nth(index + 1).fill(value);
  }
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('[data-field-root]')).not.toHaveAttribute('data-invalid');

  await openStory(page, 'sanitized-value');
  const first = page.locator('[data-pin-input-input]').first();
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy code' }).click();
  expect(
    await page.evaluate(
      /** Confirm the example's copy trigger writes the formatted code. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe('1-2-3-4');
  await first.press('ControlOrMeta+V');
  await expect(page.locator('[data-pin-input-input]').last()).toHaveValue('4');
  await expect(page.getByText('Dashes are removed before validation.')).toBeVisible();
}

test('all Pin Input examples render', verifiesInventory);
test('Pin Input entry and controlled state work', verifiesEntry);
test('Pin Input options and layouts render', verifiesOptions);
test('Pin Input store and auto-submit work', verifiesExternalState);
test('Pin Input fields, form, and sanitization work', verifiesIntegrations);
