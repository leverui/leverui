import { expect, test, type Page } from '@playwright/test';

/** Open a named Combobox gallery canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-combobox--${id}`);
}

/** Check grouped choices, multiple badges, and the controlled open label. */
async function verifiesExtendedModes({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'multiple');
  await page.getByRole('combobox').fill('type');
  await page.getByRole('option', { name: 'TypeScript' }).click();
  await expect(page.locator('[data-combobox-root] .leverui-badge')).toHaveText('TypeScript');

  await openStory(page, 'option-group');
  await page.getByRole('button', { name: 'Toggle suggestions' }).click();
  await expect(page.getByText('Frontend', { exact: true })).toBeVisible();
  await expect(page.getByText('Backend', { exact: true })).toBeVisible();

  await openStory(page, 'open-controlled');
  await expect(page.getByText('Combobox is closed')).toBeVisible();
  await page.getByRole('button', { name: 'Toggle suggestions' }).click();
  await expect(page.getByText('Combobox is open')).toBeVisible();

  await openStory(page, 'open-on-click');
  await page.getByRole('combobox').click();
  await expect(page.getByRole('option', { name: 'Solid' })).toBeVisible();

  await openStory(page, 'store');
  await page.getByRole('combobox').fill('qw');
  await expect(page.getByRole('option', { name: 'Qwik' })).toBeVisible();

  await openStory(page, 'invalid');
  await expect(page.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');

  await openStory(page, 'positioning');
  await page.getByRole('button', { name: 'Toggle suggestions' }).click();
  await expect(page.getByRole('option', { name: 'Solid' })).toBeVisible();

  await openStory(page, 'custom-animation');
  await page.getByRole('button', { name: 'Toggle suggestions' }).click();
  await expect(page.getByRole('option', { name: 'Solid' })).toBeVisible();

  await openStory(page, 'input-group');
  await expect(page.locator('.leverui-combobox__root svg.lucide-code')).toHaveCount(1);

  await openStory(page, 'field');
  await expect(page.getByText('The framework you use most')).toBeVisible();
  await page.getByRole('combobox').fill('sol');
  await expect(page.getByRole('option', { name: 'Solid' })).toBeVisible();

  await openStory(page, 'sizes');
  await expect(page.getByRole('combobox')).toHaveCount(4);
  await openStory(page, 'variants');
  await expect(page.getByRole('combobox')).toHaveCount(3);

  await openStory(page, 'custom-filter');
  await page.getByRole('combobox').fill('engineer');
  await expect(page.getByRole('option')).toHaveCount(2);
  await expect(page.getByRole('option', { name: /Hana Sato/ })).toBeVisible();

  await openStory(page, 'highlight');
  await page.getByRole('combobox').fill('sol');
  await expect(page.getByRole('option', { name: 'Solid' }).locator('mark')).toHaveText('Sol');

  await openStory(page, 'custom-object');
  await page.getByRole('combobox').fill('united');
  await expect(page.getByRole('option', { name: 'United Kingdom' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'United States' })).toBeVisible();

  await openStory(page, 'selection-behavior');
  await expect(page.getByRole('combobox')).toHaveCount(3);
  await expect(page.getByText('Selection behavior: clear')).toBeVisible();
}

/** Check the three selection policies update their own input as described. */
async function verifiesSelectionBehavior({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'selection-behavior');
  const inputs = page.getByRole('combobox');
  const expected = ['Apple', '', 'app'] as const;
  for (const [index, result] of expected.entries()) {
    await inputs.nth(index).fill('app');
    await expect(inputs.nth(index)).toHaveValue('app');
    await expect(page.getByRole('option', { name: 'Apple' })).toBeVisible();
    await page.getByRole('option', { name: 'Apple' }).click();
    await expect(inputs.nth(index)).toHaveValue(result);
    await expect(page.getByRole('listbox')).toHaveCount(0);
  }
}

/** Check the native form submits a code while the input displays a country name. */
async function verifiesNativeForm({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'form-submit');
  await page.getByRole('combobox').fill('canada');
  await page.getByRole('option', { name: /Canada/ }).click();
  await expect(page.getByRole('combobox')).toHaveValue('Canada');
  await expect(page.locator('input[name="country"]')).toHaveValue('CA');
  const dialogPromise = page.waitForEvent('dialog');
  const clickPromise = page.getByRole('button', { name: 'Submit' }).click();
  const dialog = await dialogPromise;
  expect(dialog.message()).toBe('Selected country code: CA');
  await dialog.dismiss();
  await clickPromise;
}

/** Check the popup search input and selected trigger label stay in sync. */
async function verifiesInputInContent({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'input-in-content');
  await page.getByRole('button', { name: 'Toggle suggestions' }).click();
  await page.getByRole('combobox').fill('progress');
  await expect(page.getByRole('option', { name: 'In progress' })).toBeVisible();
  await page.getByRole('option', { name: 'In progress' }).click();
  await expect(page.getByRole('button', { name: 'Toggle suggestions' })).toContainText(
    'In progress',
  );
}

/** Check the nested Combobox filters after opening its parent popover. */
async function verifiesPopover({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'open-from-popover');
  await page.getByRole('button', { name: 'Toggle popover' }).click();
  await expect(page.getByRole('combobox')).toBeVisible();
  await page.getByRole('combobox').fill('solid');
  await expect(page.getByRole('option', { name: 'Solid' })).toBeVisible();
}

/** Check filtering and selection use the framework collection. */
async function verifiesBasicSelection({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  await page.getByRole('combobox').fill('sol');
  await expect(page.getByRole('option', { name: 'Solid' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'React' })).toHaveCount(0);
  await page.getByRole('option', { name: 'Solid' }).click();
  await expect(page.getByRole('combobox')).toHaveValue('Solid');
}

/** Check controlled badges and the three-character popup threshold. */
async function verifiesVariations({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'controlled');
  await expect(page.getByText('N/A')).toBeVisible();
  await page.getByRole('combobox').fill('vue');
  await page.getByRole('option', { name: 'Vue' }).click();
  await expect(page.getByText('vue', { exact: true })).toBeVisible();

  await openStory(page, 'min-character');
  await page.getByRole('combobox').pressSequentially('so');
  await expect(page.getByRole('option', { name: 'Solid' })).toHaveCount(0);
  await page.getByRole('combobox').pressSequentially('l');
  await page.getByRole('button', { name: 'Toggle suggestions' }).click();
  await expect(page.getByRole('option', { name: 'Solid' })).toBeVisible();
}

test('Combobox basic filtering and selection work', verifiesBasicSelection);
test('Combobox controlled and minimum-character modes work', verifiesVariations);
test('Combobox extended modes work', verifiesExtendedModes);
test('Combobox selection policies update the input', verifiesSelectionBehavior);
test('Combobox form submits the selected country code', verifiesNativeForm);
test('Combobox popup input selects a status', verifiesInputInContent);
test('Combobox opens inside a popover', verifiesPopover);
