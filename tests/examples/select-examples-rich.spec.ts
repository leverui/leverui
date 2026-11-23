import { expect, test, type Page } from '@playwright/test';

/** Open one rich Select example. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-select--${id}`);
}

/** Check recipe tables, palette tokens, and popup positioning. */
async function verifiesStyles({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'sizes');
  await expect(page.getByRole('combobox')).toHaveCount(4);
  await openStory(page, 'variants');
  await expect(page.getByRole('combobox')).toHaveCount(2);
  await openStory(page, 'color-palette');
  await expect(page.getByRole('combobox')).toHaveCSS('color', /rgb/);
  await openStory(page, 'positioning');
  await page.getByRole('combobox').click();
  const triggerBox = await page.getByRole('combobox').boundingBox();
  const popupBox = await page.getByRole('listbox').boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(popupBox).not.toBeNull();
  expect(popupBox!.y + popupBox!.height).toBeLessThanOrEqual(triggerBox!.y + 1);
}

/** Check grouped, descriptive, and avatar-backed choices. */
async function verifiesRichOptions({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'option-group');
  await page.getByRole('combobox').click();
  await expect(page.getByText('Books')).toBeVisible();
  await expect(page.getByText('Movies')).toBeVisible();

  await openStory(page, 'item-description');
  await page.getByRole('combobox').click();
  await expect(page.getByText('$24/month - For growing teams')).toBeVisible();

  await openStory(page, 'avatar');
  await expect(page.getByRole('combobox')).toContainText('Mara Ellison');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: /Iris Calder/ }).click();
  await expect(page.getByRole('combobox')).toContainText('Iris Calder');

  await openStory(page, 'country');
  await expect(page.getByRole('combobox')).toContainText('Nigeria');
  await page.getByRole('combobox').click();
  await expect(page.getByText('Oceania')).toBeVisible();
}

/** Confirm overlay nesting and icon-only activation. */
async function verifiesOverlays({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'open-from-dialog');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.getByRole('combobox').click();
  await expect(page.getByRole('option', { name: 'Mobile app' })).toBeVisible();

  await openStory(page, 'open-from-popover');
  await page.getByRole('button', { name: 'Select in popover' }).click();
  await page.getByRole('combobox').click();
  await expect(page.getByRole('option', { name: 'Chloe Martin' })).toBeVisible();

  await openStory(page, 'icon-button');
  await page.getByRole('combobox', { name: 'Select shape' }).click();
  await expect(page.getByRole('option', { name: /Hexagon/ })).toBeVisible();
}

/** Resolve the async list and keep virtual options bounded. */
async function verifiesAsyncAndVirtual({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'async-loading');
  const spinner = page.locator('#storybook-root .lui-spinner');
  await expect(spinner).toBeVisible();
  await expect(spinner).toHaveCount(0);
  await page.getByRole('combobox').click();
  await expect(page.getByRole('option', { name: 'Monstera' })).toBeVisible();
  await expect(page.getByRole('option')).toHaveCount(12);

  await openStory(page, 'virtualized');
  await page.getByRole('combobox').click();
  await expect(page.getByRole('option', { name: 'Andorra' })).toBeVisible();
  const mounted = await page.getByRole('option').count();
  expect(mounted).toBeGreaterThan(0);
  expect(mounted).toBeLessThan(249);
  await page.getByRole('option', { name: 'Andorra' }).click();
  await expect(page.getByRole('combobox')).toContainText('Andorra');
  await page.getByRole('combobox').click();
  await expect(page.getByRole('listbox')).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('option', { name: 'Zimbabwe' })).toBeVisible();
}

test('Select sizes, variants, palette, and placement render', verifiesStyles);
test('Select grouped, described, avatar, and country choices work', verifiesRichOptions);
test('Select dialog, popover, and icon-button integration works', verifiesOverlays);
test('Select async and virtualized collections work', verifiesAsyncAndVirtual);
