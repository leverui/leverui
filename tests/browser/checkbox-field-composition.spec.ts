import { expect, test, type Page } from '@playwright/test';

/** Verify Checkbox inherits Fieldset and Field semantics in a real browser. */
async function verifiesCheckboxFieldComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox-field-composition--contract');
  const fieldset = page.getByTestId('topics-fieldset');
  const group = page.getByTestId('topics-group');
  const alpha = page.getByRole('checkbox', { name: 'Alpha' });
  const beta = page.getByRole('checkbox', { name: 'Beta' });
  const terms = page.getByRole('checkbox', { name: 'Accept terms' });
  await expect(fieldset).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('group', { name: 'Choose topics' })).toBeVisible();
  await expect(fieldset).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(group).toHaveAttribute('role', 'group');
  await expect(alpha).toBeEnabled();
  await expect(beta).toBeDisabled();
  await expect(terms).toHaveAttribute('required', '');
  await expect(terms).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(page.getByText('Accept the terms to continue')).toHaveCount(0);

  await alpha.focus();
  await page.keyboard.press('Space');
  await expect(alpha).toBeFocused();
  await expect(alpha).toBeChecked();
  await page.getByText('Accept terms').click();
  await expect(terms).toBeChecked();
  const initialEntries = await page.getByTestId('checkbox-context-form').evaluate(
    /** Inspect values submitted by actual native inputs. */
    (form) => Array.from(new FormData(form as HTMLFormElement).entries()),
  );
  expect(initialEntries).toContainEqual(['topics', 'alpha']);
  expect(initialEntries).toContainEqual(['terms', 'yes']);

  await page.getByTestId('toggle-group-readonly').click();
  await expect(alpha.locator('xpath=..')).toHaveAttribute('data-readonly', '');
  await alpha.focus();
  await page.keyboard.press('Space');
  await expect(alpha).toBeChecked();
  await page.getByTestId('toggle-group-readonly').click();
  await page.getByTestId('toggle-group-state').click();
  await expect(fieldset).toHaveAttribute('disabled', '');
  await expect(alpha).toBeDisabled();
  await expect(beta).toBeDisabled();
  await expect(alpha).toHaveAttribute('aria-invalid', 'true');
  await expect(terms).toHaveAttribute('aria-invalid', 'true');
  await expect(terms).toHaveAttribute('aria-describedby', /error-text/);
  await expect(fieldset).toHaveAttribute('aria-describedby', /error-text/);
  await expect(page.getByText('Choose another topic')).toBeVisible();
  await expect(page.getByText('Accept the terms to continue')).toBeVisible();

  await page.getByTestId('toggle-group-state').click();
  await expect(alpha).toBeEnabled();
  await expect(beta).toBeDisabled();
  await expect(alpha).not.toHaveAttribute('aria-invalid', 'true');
  await alpha.focus();
  await page.keyboard.press('Space');
  await expect(alpha).not.toBeChecked();
}

test('Checkbox composes with Fieldset and Field contexts', verifiesCheckboxFieldComposition);
