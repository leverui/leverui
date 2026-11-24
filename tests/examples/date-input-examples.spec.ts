import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'with-clear-trigger',
  'sizes',
  'variants',
  'disabled',
  'read-only',
  'invalid',
  'controlled',
  'default-value',
  'min-max',
  'granularity',
  'time-only',
  'time-zone',
  'range',
  'with-date-picker',
  'with-hook-form',
  'leading-zeros',
  'rtl',
  'locale',
] as const;

/** Open one Date Input example in the gallery canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-date-input--${id}`);
}

/** Require every named story to mount a real segmented editor. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  test.setTimeout(480_000);
  for (const id of storyIds) {
    await openStory(page, id);
    await expect(page.locator('[data-date-input-root]')).not.toHaveCount(0);
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Check the size and variant matrices and native state flags. */
async function verifiesMatricesAndStates({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'sizes');
  await expect(page.locator('[data-date-input-control]')).toHaveCount(7);
  await openStory(page, 'variants');
  await expect(page.locator('[data-date-input-control]')).toHaveCount(3);
  await openStory(page, 'disabled');
  await expect(page.locator('[data-date-input-control]')).toHaveAttribute('data-disabled', '');
  await openStory(page, 'invalid');
  await expect(page.locator('[data-date-input-control]')).toHaveAttribute('data-invalid', '');
}

/** Confirm the clear trigger removes the selected date and its form value. */
async function verifiesClearTrigger({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'with-clear-trigger');
  await expect(page.getByRole('button', { name: 'Clear date' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear date' }).click();
  await expect(page.getByRole('button', { name: 'Clear date' })).toHaveCount(0);
  await expect(page.locator('[data-date-input-hidden-input]')).toHaveValue('');
}

test('all Date Input stories render', verifiesInventory);
test('Date Input matrices and state flags match', verifiesMatricesAndStates);
test('Date Input clear trigger resets the date', verifiesClearTrigger);
