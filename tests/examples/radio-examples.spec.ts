import { expect, test, type Page } from '@playwright/test';

const stories = [
  'basic',
  'controlled',
  'sizes',
  'variants',
  'colors',
  'disabled',
  'hook-form',
  'size-matrix',
  'variant-matrix',
];

/** Check that every Radio example renders its expected controls. */
async function verifiesRadioStories({ page }: { page: Page }): Promise<void> {
  for (const story of stories) {
    await page.goto(`/iframe.html?id=components-radio--${story}`);
    await expect(
      page.locator('#storybook-root [data-radio-group-root] input[type="radio"]').first(),
    ).toBeAttached();
  }
}

/** Check the initial and controlled selection behavior. */
async function verifiesRadioSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio--basic');
  await expect(page.getByRole('radio', { name: 'Standard' })).toBeChecked();
  await page.getByText('Express').click();
  await expect(page.getByRole('radio', { name: 'Express' })).toBeChecked();

  await page.goto('/iframe.html?id=components-radio--controlled');
  await expect(page.getByRole('radio', { name: 'Standard' })).not.toBeChecked();
  await page.getByText('Pickup').click();
  await expect(page.getByRole('radio', { name: 'Pickup' })).toBeChecked();
}

/** Check the disabled item and the two ten-palette recipe matrices. */
async function verifiesRadioTables({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio--disabled');
  await expect(page.getByRole('radio', { name: 'Express' })).toBeDisabled();
  for (const story of ['size-matrix', 'variant-matrix']) {
    await page.goto(`/iframe.html?id=components-radio--${story}`);
    await expect(page.locator('#storybook-root table tbody tr')).toHaveCount(10);
  }
  await page.goto('/iframe.html?id=components-radio--size-matrix');
  await expect(page.locator('#storybook-root table thead th')).toHaveCount(5);
  await page.goto('/iframe.html?id=components-radio--variant-matrix');
  await expect(page.locator('#storybook-root table thead th')).toHaveCount(4);
}

/** Check the form's missing-value error and native selected value. */
async function verifiesRadioForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio--hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Choose a delivery method')).toBeVisible();
  await page.getByText('Express').click();
  await expect(page.getByText('Choose a delivery method')).toHaveCount(0);
  await expect(page.getByRole('radio', { name: 'Express' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Express' })).toHaveAttribute('name', 'value');
}

test('Radio stories render', verifiesRadioStories);
test('Radio Basic and Controlled selection works', verifiesRadioSelection);
test('Radio recipe tables preserve every dimension', verifiesRadioTables);
test('Radio form validates and selects', verifiesRadioForm);
