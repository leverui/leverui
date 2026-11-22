import { expect, test, type Page } from '@playwright/test';

/** Read the actual form's constraint status and submitted radio values. */
function formState(element: HTMLElement): {
  valid: boolean;
  values: Record<string, FormDataEntryValue>;
} {
  const form = element as HTMLFormElement;
  return {
    valid: form.checkValidity(),
    values: Object.fromEntries(new FormData(form)),
  };
}

/** Verify required radios block an empty form and invalid markers reach inputs. */
async function verifiesValidationStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group-family-validation--validation');
  const form = page.getByTestId('segment-validation-form');
  const required = page.getByRole('radiogroup', { name: 'Required choice' });
  const invalid = page.getByRole('radiogroup', { name: 'Invalid choice' });
  await expect(required).toHaveAttribute('aria-required', 'true', { timeout: 30_000 });
  await expect(required.getByRole('radio', { name: 'First' })).toHaveAttribute('required', '');
  await expect(invalid).toHaveAttribute('data-invalid');
  await expect(invalid.getByRole('radio', { name: 'First' })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  expect(await form.evaluate(formState)).toEqual({ valid: false, values: { invalid: 'First' } });
  await required.getByText('Second').click();
  expect(await form.evaluate(formState)).toEqual({
    valid: true,
    values: { required: 'Second', invalid: 'First' },
  });
}

test(
  'Segment Group required and invalid states retain native form behavior',
  verifiesValidationStates,
);
