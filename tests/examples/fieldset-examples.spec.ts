import { expect, test, type Page } from '@playwright/test';

/** Check basic field names and the native country options. */
async function verifiesFieldsetBasic({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-fieldset--basic');
  await expect(page.locator('#storybook-root fieldset')).toHaveCount(1);
  await expect(page.getByRole('group', { name: 'Contact details' })).toBeVisible();
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Email address')).toBeVisible();
  expect(await page.getByLabel('Country').locator('option').allTextContents()).toEqual([
    'United Kingdom',
    'Canada',
    'United States',
  ]);
}

/** Check native disabled propagation and invalid field semantics. */
async function verifiesFieldsetStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-fieldset--disabled');
  await expect(page.locator('#storybook-root fieldset')).toHaveAttribute('disabled', '');
  await expect(page.getByLabel('Street address')).toBeDisabled();
  await expect(page.getByLabel('Country')).toBeDisabled();
  await expect(page.getByLabel('Delivery notes')).toBeDisabled();
  await page.goto('/iframe.html?id=components-fieldset--invalid');
  await expect(page.getByLabel('Country')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Notes')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Some fields are invalid. Please check them.')).toBeVisible();
}

test('Fieldset Basic preserves the contact form', verifiesFieldsetBasic);
test('Fieldset Disabled and Invalid preserve form semantics', verifiesFieldsetStates);
