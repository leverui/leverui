import { expect, test, type Page } from '@playwright/test';

/** Read the checked native value from a real form boundary. */
function formValue(element: HTMLElement, name: string): FormDataEntryValue | null {
  if (!(element instanceof HTMLFormElement)) {
    throw new TypeError('Switch guide expected a native form.');
  }
  return new FormData(element).get(name);
}

/** Verify controller blur, validation, accessible error, and submitted value. */
async function verifiesGuideForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch-guide-form--controlled');
  const form = page.getByTestId('switch-guide-form');
  const input = form.getByRole('checkbox', { name: 'Activate account' });
  await expect(input).not.toBeChecked({ timeout: 30_000 });
  await expect(form).toHaveAttribute('data-touched', 'false');
  await input.focus();
  await input.press('Tab');
  await expect(form).toHaveAttribute('data-touched', 'true');
  await form.getByRole('button', { name: 'Submit activation' }).click();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAccessibleDescription('Active is required');
  await expect(form.getByText('Active is required')).toBeVisible();
  await input.focus();
  await input.press('Space');
  await expect(input).toBeChecked();
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  await expect(input).not.toHaveAttribute('aria-describedby', /.+/);
  expect(await form.evaluate(formValue, 'active')).toBe('yes');
  await form.getByRole('button', { name: 'Submit activation' }).click();
  await expect(page.getByTestId('switch-guide-result')).toHaveText('true');
  await input.focus();
  await input.press('Space');
  await expect(input).not.toBeChecked();
  expect(await form.evaluate(formValue, 'active')).toBeNull();
  await form.getByRole('button', { name: 'Submit activation' }).click();
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('switch-guide-result')).toHaveText('false');
}

test('Switch integrates with a controlled Solid form', verifiesGuideForm);
