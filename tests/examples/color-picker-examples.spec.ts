import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'change-end',
  'open-from-dialog',
  'channel-slider-only',
  'controlled',
  'hook-form',
  'inline',
  'input-only',
  'swatch-only',
  'trigger-only',
  'channel-input',
  'disabled',
  'fit-content',
  'format',
  'readonly',
  'save-swatch',
  'sizes',
  'swatch-and-input',
  'swatches',
  'swatches-and-trigger',
  'trigger-in-input',
  'trigger-inside-input',
  'swatch-and-trigger',
  'store',
  'variants',
] as const;

/** Open one Color Picker example in the Storybook canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-color-picker--${id}`);
}

/** Verify every example mounts a picker. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  test.setTimeout(180_000);
  for (const id of storyIds) {
    await openStory(page, id);
    if (id === 'open-from-dialog') {
      await page.getByRole('button', { name: 'Open dialog' }).click();
    }
    await expect(page.locator('[data-color-picker-root]')).not.toHaveCount(0);
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Exercise the basic popup, direct swatches, and disabled control. */
async function verifiesCoreActions({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  await page.locator('[data-color-picker-trigger]').click();
  await expect(page.locator('[data-color-picker-content]')).toBeVisible();

  await openStory(page, 'swatch-only');
  await page.locator('[data-color-picker-swatch-trigger]').first().click();
  await expect(page.locator('[data-color-picker-value-text]')).not.toBeEmpty();

  await openStory(page, 'disabled');
  await expect(page.locator('[data-color-picker-trigger]')).toBeDisabled();
}

/** Keep the dialog popup in the active dialog's focus scope. */
async function verifiesDialog({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'open-from-dialog');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').locator('[data-color-picker-trigger]').click();
  await expect(page.getByRole('dialog').locator('[data-color-picker-content]')).toBeVisible();
}

test('all Color Picker stories render', verifiesInventory);
test('Color Picker core actions work', verifiesCoreActions);
test('Color Picker works inside a dialog', verifiesDialog);

/** Keep color fields clear of both Input Group adornments through authored CSS. */
async function verifiesInputGroupPadding({ page }: { page: Page }): Promise<void> {
  for (const id of ['input-only', 'trigger-in-input']) {
    await openStory(page, id);
    const input = page.locator('.lui-input-group__field');
    await expect(input).toBeVisible();
    await expect(input).toHaveCSS('padding-inline-start', '40px');
    await expect(input).toHaveCSS('padding-inline-end', '40px');
  }
}

test('Color Picker input groups use authored field padding', verifiesInputGroupPadding);

/** Verify portal content receives the root's finite appearance choices. */
async function verifiesPortalAppearance({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'swatch-and-input');
  const root = page.locator('.lui-color-picker__root');
  await expect(root).toHaveAttribute('data-size', 'xs');
  await root.locator('.lui-color-picker__trigger').click();
  const content = page.getByRole('dialog');
  await expect(content).toHaveAttribute('data-size', 'xs');
  await expect(content).toHaveAttribute('data-lui-color-picker-css', '');
}

test('Color Picker appearance reaches portaled content', verifiesPortalAppearance);
