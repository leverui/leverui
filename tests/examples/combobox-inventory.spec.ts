import { expect, test, type Page } from '@playwright/test';

const stories = [
  'basic',
  'auto-highlight',
  'controlled',
  'multiple',
  'option-group',
  'min-character',
  'disabled',
  'disabled-item',
  'async',
  'open-from-popover',
  'rehydrate-value',
  'custom-item',
  'open-controlled',
  'highlight',
  'sizes',
  'variants',
  'links',
  'open-on-click',
  'store',
  'virtualized',
  'limit',
  'positioning',
  'custom-animation',
  'invalid',
  'input-group',
  'field',
  'custom-filter',
  'custom-object',
  'input-in-content',
  'form-submit',
  'hook-form',
  'createable',
  'selection-behavior',
  'color-picker',
] as const;

/** Check every implemented Combobox story mounts its relevant controls. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  // Opens many stories in one test, so allow longer than the default.
  test.setTimeout(720_000);
  for (const id of stories) {
    await page.goto(`/iframe.html?id=components-combobox--${id}`);
    if (id === 'open-from-popover') {
      await page.getByRole('button', { name: 'Toggle popover' }).click();
    }
    if (id === 'input-in-content') {
      await page.getByRole('button', { name: 'Toggle suggestions' }).click();
    }
    await expect(page.getByRole('combobox').first()).toBeVisible();
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
  await page.goto('/iframe.html?id=components-combobox--disabled');
  await expect(page.getByRole('combobox')).toBeDisabled();
}

test('Combobox gallery examples render their controls', verifiesInventory);
