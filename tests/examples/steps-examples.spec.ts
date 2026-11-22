import { expect, test, type Page } from '@playwright/test';

const stories = [
  'basic',
  'controlled',
  'sizes',
  'validation',
  'variants',
  'colors',
  'size-matrix',
  'variant-matrix',
  'vertical',
  'description',
  'icon',
  'lines',
  'store',
  'trigger',
  'number-only',
] as const;

/** Require each named example to render a working Steps root. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const story of stories) {
    await page.goto(`/iframe.html?id=components-steps--${story}`);
    await expect(page.locator('[data-steps-root]').first()).toBeVisible();
  }
}

/** Advance the default and controlled examples through completion. */
async function verifiesNavigation({ page }: { page: Page }): Promise<void> {
  for (const story of ['basic', 'controlled', 'store']) {
    await page.goto(`/iframe.html?id=components-steps--${story}`);
    await expect(page.getByText('Add your name and a photo.')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Check your details before you finish.')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('All steps are complete!')).toBeVisible();
  }
}

/** Check both recipe tables and the description and icon structures. */
async function verifiesMatricesAndContent({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-steps--size-matrix');
  await expect(page.locator('tbody [data-steps-root]')).toHaveCount(8);
  await page.goto('/iframe.html?id=components-steps--variant-matrix');
  await expect(page.locator('tbody [data-steps-root]')).toHaveCount(20);
  await page.goto('/iframe.html?id=components-steps--sizes');
  await expect(page.locator('[data-steps-root]')).toHaveCount(3);
  await page.goto('/iframe.html?id=components-steps--variants');
  await expect(page.locator('[data-steps-root]')).toHaveCount(2);
  await page.goto('/iframe.html?id=components-steps--colors');
  await expect(page.locator('[data-steps-root]')).toHaveCount(10);
  await page.goto('/iframe.html?id=components-steps--description');
  await expect(page.getByText('About you')).toBeVisible();
  await page.goto('/iframe.html?id=components-steps--icon');
  await expect(page.locator('[data-steps-indicator] .lucide')).toHaveCount(3);
}

/** Block advancement until the current registration field passes validation. */
async function verifiesValidation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-steps--validation');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('tabpanel').getByText('Step 1 is invalid')).toBeVisible();
  await page.getByPlaceholder('Enter your name').fill('Ada');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByPlaceholder('email@example.com')).toBeVisible();
  await page.getByPlaceholder('email@example.com').fill('ada@example.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByPlaceholder('Enter password').fill('password123');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Registration complete!')).toBeVisible();
}

test('all Steps examples render', verifiesInventory);
test('Steps examples navigate to completion', verifiesNavigation);
test('Steps matrices and content render', verifiesMatricesAndContent);
test('Steps validation blocks incomplete registration', verifiesValidation);
