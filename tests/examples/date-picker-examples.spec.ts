import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'sizes',
  'variants',
  'disabled',
  'read-only',
  'controlled',
  'store',
  'default-value',
  'default-view',
  'range-selection',
  'multiple-selection',
  'month-picker',
  'month-range',
  'year-picker',
  'year-range',
  'min-max',
  'unavailable-dates',
  'format-parse',
  'localization',
  'persian-calendar',
  'button-trigger',
  'outside-icon',
  'input-group',
  'clear-icon',
  'placement',
  'header-layout',
  'month-year-select',
  'multiple-months',
  'presets',
  'presets-sidebar',
  'today-button',
  'with-time',
  'form',
  'hook-form',
  'field',
  'fixed-weeks',
  'open-on-click',
] as const;

/** Open one Date Picker example in the gallery canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-date-picker--${id}`);
}

/** Require every named example to render its actual picker control. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  test.setTimeout(480_000);
  for (const id of storyIds) {
    await openStory(page, id);
    await expect(page.locator('[data-date-picker-root]')).not.toHaveCount(0);
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Match the size and variant matrices and native state flags. */
async function verifiesMatricesAndStates({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'sizes');
  await expect(page.locator('[data-date-picker-control]')).toHaveCount(5);
  await openStory(page, 'variants');
  await expect(page.locator('[data-date-picker-control]')).toHaveCount(3);
  await openStory(page, 'disabled');
  await expect(page.locator('[data-date-picker-control]')).toHaveAttribute('data-disabled', '');
  await openStory(page, 'read-only');
  await expect(page.locator('[data-date-picker-input]')).toHaveAttribute('readonly', '');
}

/** Verify the popup exposes a usable day table and selected date. */
async function verifiesBasicSelection({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  await page.locator('[data-date-picker-trigger]').click();
  await expect(page.locator('[data-date-picker-table]').filter({ visible: true })).toHaveCount(1);
  await page
    .locator('[data-date-picker-table-cell-trigger]:not([aria-disabled="true"])')
    .filter({ visible: true })
    .first()
    .click();
  await expect(page.locator('[data-date-picker-input]')).not.toHaveValue('');
}

test('all Date Picker stories render', verifiesInventory);
test('Date Picker matrices and state flags match', verifiesMatricesAndStates);
test('Date Picker selects a day from its popup', verifiesBasicSelection);

/** Keep the date field clear of both Input Group adornments through authored CSS. */
async function verifiesInputGroupPadding({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'input-group');
  const input = page.locator('.lui-input-group__field');
  await expect(input).toBeVisible();
  await expect(input).toHaveCSS('padding-inline-start', '40px');
  await expect(input).toHaveCSS('padding-inline-end', '40px');
}

test('Date Picker gallery input group uses authored field padding', verifiesInputGroupPadding);
