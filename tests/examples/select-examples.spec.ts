import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'async-loading',
  'basic',
  'controlled',
  'open-from-dialog',
  'open-from-popover',
  'avatar',
  'clear',
  'country',
  'disabled',
  'disabled-option',
  'hook-form',
  'icon-button',
  'invalid',
  'item-description',
  'multiple',
  'native-form',
  'option-group',
  'overflow',
  'positioning',
  'sizes',
  'variants',
  'color-palette',
  'virtualized',
] as const;

/** Open a named Select example from the curated Storybook gallery. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-select--${id}`);
}

/** Require each of the 23 Select stories to mount. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  test.setTimeout(300_000);
  for (const id of storyIds) {
    await openStory(page, id);
    await expect(page.locator('#storybook-root')).not.toBeEmpty();
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Pick an option with both uncontrolled and caller-owned state. */
async function verifiesSelection({ page }: { page: Page }): Promise<void> {
  const cases: readonly (readonly [story: string, option: string])[] = [
    ['basic', 'Paris'],
    ['controlled', 'Euro'],
  ];
  for (const [story, option] of cases) {
    await openStory(page, story);
    const trigger = page.getByRole('combobox');
    await trigger.click();
    await page.getByRole('option', { name: option }).click();
    await expect(trigger).toContainText(option);
  }

  await openStory(page, 'multiple');
  const multiple = page.getByRole('combobox');
  await multiple.click();
  await page.getByRole('option', { name: 'Red' }).click();
  await page.getByRole('option', { name: 'Blue' }).click();
  await expect(multiple).toContainText('Red');
  await expect(multiple).toContainText('Blue');
}

/** Check clearing, disabled controls, and disabled options. */
async function verifiesDisabledAndClear({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'clear');
  await expect(page.getByRole('combobox')).toContainText('The Lantern Keeper');
  await page.getByRole('button', { name: /clear/i }).click();
  await expect(page.getByRole('combobox')).toContainText('Select book');

  await openStory(page, 'disabled');
  await expect(page.getByRole('combobox')).toBeDisabled();

  await openStory(page, 'disabled-option');
  await page.getByRole('combobox').click();
  await expect(page.getByRole('option', { name: 'Cat' })).toHaveAttribute('aria-disabled', 'true');
}

/** Exercise native form value and required Solid form behavior. */
async function verifiesForms({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'native-form');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Support' }).click();
  await expect(page.locator('select[name="department"]')).toHaveValue('support');
  await page.getByRole('button', { name: 'Submit' }).click();

  await openStory(page, 'hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Role is required')).toBeVisible();
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Editor' }).click();
  await expect(page.getByText('Role is required')).toHaveCount(0);
}

test('all Select stories render', verifiesInventory);
test('Select basic, controlled, and multiple values update', verifiesSelection);
test('Select clear and disabled states work', verifiesDisabledAndClear);
test('Select native and controlled forms work', verifiesForms);
