import { expect, test, type Page } from '@playwright/test';

/** Open one Color Picker example in the Storybook canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-color-picker--${id}`);
}

/** Verify a saved custom color becomes a selectable swatch. */
async function verifiesSavedSwatch({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'save-swatch');
  await page.locator('[data-color-picker-trigger]').click();
  await expect(page.locator('[data-color-picker-swatch-trigger]')).toHaveCount(4);
  await page.getByRole('button', { name: 'Add a swatch' }).click();
  await expect(page.locator('[data-color-picker-area]')).toBeVisible();
  await page.getByRole('button', { name: 'Save swatch' }).click();
  await expect(page.locator('[data-color-picker-swatch-trigger]')).toHaveCount(5);
}

/** Verify the channel editor reveals numeric fields and format controls. */
async function verifiesChannelEditor({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'channel-input');
  await page.locator('[data-color-picker-trigger]').click();
  await expect(page.locator('[data-color-picker-channel-input]')).not.toHaveCount(0);
  await expect(page.locator('[data-color-picker-area]')).toBeVisible();

  await openStory(page, 'channel-slider-only');
  await page.locator('[data-color-picker-trigger]').click();
  await expect(page.locator('[data-color-picker-format-select]')).toBeVisible();
  await expect(page.locator('[data-color-picker-channel-slider]')).not.toHaveCount(0);
}

/** Check the seven sizes and two variants match the matrices. */
async function verifiesMatrices({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'sizes');
  await expect(page.locator('[data-color-picker-trigger]')).toHaveCount(7);
  await openStory(page, 'variants');
  await expect(page.locator('[data-color-picker-trigger]')).toHaveCount(2);
}

test('Color Picker saves a custom swatch', verifiesSavedSwatch);
test('Color Picker channel editors render their real controls', verifiesChannelEditor);
test('Color Picker size and variant matrices are complete', verifiesMatrices);
