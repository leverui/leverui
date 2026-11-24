import { expect, test, type Page } from '@playwright/test';

/** Read the page's current clock time. */
function readNow(): number {
  return Date.now();
}

/** Open one advanced Combobox gallery canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-combobox--${id}`);
}

/** Check filtered options retain their real documentation destinations. */
async function verifiesLinks({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'links');
  await page.getByRole('combobox').fill('solid');
  const option = page.getByRole('option', { name: 'Solid' });
  await expect(option).toBeVisible();
  await expect(option).toHaveAttribute('href', 'https://solidjs.com');
}

test('Combobox options can be documentation links', verifiesLinks);

/** Check the default and filtered result sets never exceed the configured cap. */
async function verifiesLimit({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'limit');
  await page.getByRole('button', { name: 'Toggle suggestions' }).click();
  await expect(page.getByRole('option')).toHaveCount(10);
  await page.getByRole('combobox').fill('uni');
  await expect(page.getByRole('option')).toHaveCount(4);
  await expect(page.getByRole('option', { name: 'United States of America' })).toBeVisible();
}

test('Combobox limits country suggestions', verifiesLimit);

/** Check a car brand selection renders its initials preview row. */
async function verifiesCustomItem({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'custom-item');
  await page.getByRole('combobox').fill('land');
  await page.getByRole('option', { name: /Land Rover/ }).click();
  const preview = page.locator('#storybook-root [data-avatar-fallback]', { hasText: 'LR' });
  await expect(preview).toBeVisible();
  await expect(page.getByText('Land Rover', { exact: true }).first()).toBeVisible();
}

test('Combobox previews selected car brands', verifiesCustomItem);

/** Check required validation clears after a selection and submits its value. */
async function verifiesHookForm({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Framework is required')).toBeVisible();
  await page.getByRole('combobox').fill('solid');
  await page.getByRole('option', { name: 'Solid' }).click();
  await expect(page.getByText('Framework is required')).toHaveCount(0);
  const dialogPromise = page.waitForEvent('dialog');
  const clickPromise = page.getByRole('button', { name: 'Submit' }).click();
  const dialog = await dialogPromise;
  expect(dialog.message()).toBe('Selected framework: solid');
  await dialog.dismiss();
  await clickPromise;
}

test('Combobox required framework form validates and submits', verifiesHookForm);

/** Check the Halcyon option remains visible and disabled. */
async function verifiesDisabledItem({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'disabled-item');
  await page.getByRole('button', { name: 'Toggle suggestions' }).click();
  const halcyon = page.getByRole('option', { name: 'Halcyon' });
  await expect(halcyon).toBeVisible();
  await expect(halcyon).toHaveAttribute('aria-disabled', 'true');
  await expect(halcyon.locator('svg[aria-label="Halcyon"]')).toHaveCount(1);
  await page.getByRole('option', { name: 'Northwind' }).click();
  await expect(page.getByRole('combobox')).toHaveValue('Northwind');
}

test('Combobox branded company list disables Halcyon', verifiesDisabledItem);

/** Check asynchronous crew results, loading feedback, and request failures. */
async function verifiesAsync({ page }: { page: Page }): Promise<void> {
  await page.clock.install();
  await openStory(page, 'async');
  const input = page.getByRole('combobox');
  await expect(input).toBeVisible();
  // Hold the simulated request so slow machines still see the brief loading state.
  await page.clock.pauseAt((await page.evaluate(readNow)) + 1_000);
  await input.fill('rhea');
  await expect(page.getByText('Loading...')).toBeVisible();
  await page.clock.resume();
  await expect(page.getByRole('option', { name: /Rhea Solano/ })).toBeVisible();
  await expect(page.getByRole('option')).toHaveCount(1);
  await page.context().setOffline(true);
  await input.fill('juno');
  await expect(page.getByText('Could not load the crew')).toBeVisible();
  await page.context().setOffline(false);
  await input.fill('jun');
  await expect(page.getByRole('option', { name: /Juno Marchetti/ })).toBeVisible();
}

test('Combobox searches async crew members and reports failures', verifiesAsync);

/** Check a default value resolves to its selected item after async loading. */
async function verifiesRehydration({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'rehydrate-value');
  await expect(page.getByRole('combobox')).toHaveValue('Juno Marchetti');
  await page.getByRole('combobox').press('ArrowDown');
  const option = page.getByRole('option', { name: /Juno Marchetti/ });
  await expect(option).toBeVisible();
  await expect(option).toHaveAttribute('aria-selected', 'true');
}

test('Combobox rehydrates a default selection after loading', verifiesRehydration);

/** Check the full country collection renders only a virtual window. */
async function verifiesVirtualized({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'virtualized');
  await page.getByRole('button', { name: 'Toggle suggestions' }).click();
  await expect(page.getByRole('option', { name: /Andorra/ })).toBeVisible();
  expect(await page.getByRole('option').count()).toBeLessThan(249);
  await page.getByRole('combobox').press('End');
  await expect(page.getByRole('option', { name: /Zimbabwe/ })).toBeVisible();
  await page.getByRole('combobox').fill('uni');
  await expect(page.getByRole('option', { name: 'United States of America' })).toBeVisible();
}

test('Combobox virtualizes its 249-country collection', verifiesVirtualized);

/** Check choosing a named color updates the input and preview swatch. */
async function verifiesColorPicker({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'color-picker');
  await page.getByRole('combobox').fill('blue');
  await page.getByRole('option', { name: /Blue/ }).click();
  await expect(page.getByRole('combobox')).toHaveValue('Blue');
  await expect(page.locator('[data-value="#3B82F6"]')).toHaveCount(2);
  await expect(page.locator('[data-value="#3B82F6"]').first()).toBeVisible();
}

test('Combobox color picker previews the selected swatch', verifiesColorPicker);

/** Check a typed framework becomes a persistent marked-new option. */
async function verifiesCreation({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'createable');
  await page.getByRole('combobox').fill('Astro');
  await page.getByRole('option', { name: /Create "Astro"/ }).click();
  await expect(page.getByRole('combobox')).toHaveValue('Astro');
  await page.getByRole('button', { name: 'Toggle suggestions' }).click();
  await expect(page.getByRole('option', { name: /Astro NEW/ })).toBeVisible();
}

test('Combobox creates and retains a new framework', verifiesCreation);
