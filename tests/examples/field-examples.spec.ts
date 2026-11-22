import { expect, test, type Page } from '@playwright/test';

/** Verify the basic field labels its editable native input. */
async function verifiesFieldBasic({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-field--basic');
  const email = page.getByRole('textbox', { name: 'Email' });
  await expect(email).toHaveAttribute('placeholder', 'me@example.com');
  await email.fill('person@example.com');
  await expect(email).toHaveValue('person@example.com');
}

/** Verify disabled, invalid, helper, and required semantics on the native input. */
async function verifiesFieldStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-field--disabled');
  await expect(page.getByRole('textbox', { name: 'Email' })).toBeDisabled();

  for (const story of ['error-icon', 'error-text']) {
    await page.goto(`/iframe.html?id=components-field--${story}`);
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  }
  await page.goto('/iframe.html?id=components-field--error-icon');
  await expect(page.locator('#storybook-root svg')).toHaveCount(1);

  await page.goto('/iframe.html?id=components-field--helper-text');
  await expect(page.getByText('We only use your email to sign you in.')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
    'aria-describedby',
    /helper-text/,
  );

  await page.goto('/iframe.html?id=components-field--optional');
  await expect(page.getByText('Optional')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('required');
  await page.goto('/iframe.html?id=components-field--required');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveAttribute('required', '');
}

/** Verify horizontal layout includes both inputs and a working switch. */
async function verifiesFieldHorizontal({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-field--horizontal');
  await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  await expect(page.locator('[data-field-label]').first()).toHaveCSS('flex-basis', '96px');
  const hideEmail = page.getByRole('checkbox', { name: 'Hide email' });
  await expect(hideEmail).toBeAttached();
  await page.locator('[data-switch-control]').click();
  await expect(hideEmail).toBeChecked();
}

/** Verify Field connects its label to Native Select's real control. */
async function verifiesFieldNativeSelect({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-field--native-select');
  const select = page.getByRole('combobox', { name: 'Plan' });
  await expect(select.locator('option')).toHaveText(['Free', 'Pro', 'Team']);
  await select.selectOption('2');
  await expect(select).toHaveValue('2');
}

test('Field Basic labels and edits its input', verifiesFieldBasic);
test('Field state stories preserve native semantics', verifiesFieldStates);
test('Field Horizontal preserves controls', verifiesFieldHorizontal);
test('Field NativeSelect labels its control', verifiesFieldNativeSelect);
