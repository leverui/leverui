import { expect, test, type Page } from '@playwright/test';

/** Read one named value from the mounted native form. */
function readFormValue(element: HTMLElement, name: string): FormDataEntryValue | null {
  return new FormData(element as HTMLFormElement).get(name);
}

/** Read the validity of the mounted native form. */
function readFormValidity(element: HTMLElement): boolean {
  return (element as HTMLFormElement).checkValidity();
}

/** Check Zag's required input and the browser's actual empty-score value. */
async function verifiesRequiredRating({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating-group-family-states--states');
  const form = page.getByTestId('rating-group-state-form');
  const required = page.getByTestId('rating-required');
  await expect(required.getByRole('radiogroup', { name: 'Required score' })).toBeVisible();
  await expect(required.getByRole('radio')).toHaveCount(3);
  await expect(required.locator('input[name="required"]')).toHaveAttribute('required', '');
  expect(await form.evaluate(readFormValidity)).toBe(true);
  expect(await form.evaluate(readFormValue, 'required')).toBe('-1');
  await required.getByRole('radio', { name: '2 stars' }).click();
  await expect(required.getByRole('radio', { name: '2 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  expect(await form.evaluate(readFormValidity)).toBe(true);
  expect(await form.evaluate(readFormValue, 'required')).toBe('2');
}

test('Rating Group required input retains the empty-score value', verifiesRequiredRating);

/** Preserve a read-only score while omitting a disabled score from FormData. */
async function verifiesUnavailableRatings({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating-group-family-states--states');
  const form = page.getByTestId('rating-group-state-form');
  const readonly = page.getByTestId('rating-readonly');
  const disabled = page.getByTestId('rating-disabled');
  await expect(readonly.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true');
  await expect(readonly.locator('input[name="readonly"]')).toHaveAttribute('readonly', '');
  await readonly.getByRole('radio', { name: '3 stars' }).click({ force: true });
  await expect(readonly.getByRole('radio', { name: '2 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  expect(await form.evaluate(readFormValue, 'readonly')).toBe('2');
  await expect(disabled.getByRole('radio', { name: '3 stars' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await disabled.getByRole('radio', { name: '3 stars' }).click({ force: true });
  await expect(disabled.getByRole('radio', { name: '2 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  expect(await form.evaluate(readFormValue, 'disabled')).toBeNull();
}

test(
  'Rating Group read-only and disabled states keep native form semantics',
  verifiesUnavailableRatings,
);
