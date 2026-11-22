import { expect, test, type Page } from '@playwright/test';

/** Read native validity from the mounted form. */
function readFormValidity(element: HTMLElement): boolean {
  return (element as HTMLFormElement).checkValidity();
}

/** Read one native field value from the mounted form. */
function readFormValue(element: HTMLElement, name: string): FormDataEntryValue | null {
  return new FormData(element as HTMLFormElement).get(name);
}

/** Verify native validity and submission alongside the primitive's invalid state. */
async function verifiesRequiredAndInvalid({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-group-family-states--states');
  const form = page.getByTestId('radio-group-state-form');
  const required = page.getByTestId('radio-group-required');
  const invalid = page.getByTestId('radio-group-invalid');
  await expect(required.getByRole('radio')).toHaveCount(2, { timeout: 45_000 });
  await expect(required).toHaveAttribute('aria-required', 'true');
  expect(await form.evaluate(readFormValidity)).toBe(false);
  await required.getByText('Required two').click();
  await expect(required.getByRole('radio', { name: 'Required two' })).toBeChecked();
  expect(await form.evaluate(readFormValidity)).toBe(true);
  expect(await form.evaluate(readFormValue, 'required')).toBe('two');
  await expect(invalid).toHaveAttribute('data-invalid', '');
  await expect(invalid.getByRole('radio', { name: 'Invalid one' })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(invalid.getByRole('radio', { name: 'Invalid one' })).toBeChecked();
}

test(
  'Radio Group required and invalid states retain native form behavior',
  verifiesRequiredAndInvalid,
);

/** Keep disabled and read-only choices from changing their selected value. */
async function verifiesUnavailableGroups({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-group-family-states--states');
  const readonly = page.getByTestId('radio-group-readonly');
  const disabled = page.getByTestId('radio-group-disabled');
  // Zag 2 submits a read-only group's value, so read-only radios stay enabled
  // and ignore changes instead of being disabled.
  await expect(readonly.getByRole('radio', { name: 'Read-only two' })).toBeEnabled();
  await expect(readonly.getByText('Read-only two')).toHaveAttribute('data-readonly', '');
  await readonly.getByText('Read-only two').click({ force: true });
  await expect(readonly.getByRole('radio', { name: 'Read-only one' })).toBeChecked();
  await expect(readonly.getByRole('radio', { name: 'Read-only two' })).not.toBeChecked();
  expect(await page.getByTestId('radio-group-state-form').evaluate(readFormValue, 'readonly')).toBe(
    'one',
  );
  await expect(disabled.getByRole('radio', { name: 'Disabled one' })).toBeDisabled();
  await expect(disabled.getByRole('radio', { name: 'Disabled two' })).toBeDisabled();
  await disabled.getByText('Disabled two').click({ force: true });
  await expect(disabled.getByRole('radio', { name: 'Disabled two' })).not.toBeChecked();
  expect(
    await page.getByTestId('radio-group-state-form').evaluate(readFormValue, 'disabled'),
  ).toBeNull();
}

test('Radio Group read-only and disabled states block selection', verifiesUnavailableGroups);
