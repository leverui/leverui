import { expect, test, type Locator, type Page } from '@playwright/test';

/** Find Zag 2 number fields, which are text inputs described as a "number field". */
function numberFields(page: Page): Locator {
  return page.locator('[aria-roledescription="number field"]');
}

const storyIds = [
  'basic',
  'controlled',
  'disabled',
  'field',
  'format-options',
  'hook-form',
  'invalid',
  'min-max',
  'mouse-wheel',
  'scrubber',
  'sizes',
  'step',
  'stepper',
  'element',
] as const;

/** Open one curated Number Input story. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-numberinput--${id}`);
}

/** Require every example to expose its numeric value. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await openStory(page, id);
    if (id === 'stepper') {
      await expect(page.getByText('3', { exact: true })).toBeVisible();
      continue;
    }
    await expect(numberFields(page).first()).toBeVisible();
  }
}

/** Check default, stepped, bounded, disabled, and controlled updates. */
async function verifiesNumericState({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  await expect(numberFields(page)).toHaveValue('10');
  await page.getByRole('button', { name: 'increment value' }).click();
  await expect(numberFields(page)).toHaveValue('11');

  await openStory(page, 'step');
  await page.getByRole('button', { name: 'increment value' }).click();
  await expect(numberFields(page)).toHaveValue('5');

  await openStory(page, 'min-max');
  await numberFields(page).fill('100');
  await numberFields(page).press('Tab');
  await expect(numberFields(page)).toHaveValue('50');

  await openStory(page, 'disabled');
  await expect(numberFields(page)).toBeDisabled();

  await openStory(page, 'controlled');
  await page.getByRole('button', { name: 'increment value' }).click();
  await expect(numberFields(page)).toHaveValue('11');
}

/** Check formatting, icon controls, and the four size examples. */
async function verifiesDisplay({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'format-options');
  await expect(numberFields(page)).toHaveCount(3);
  await expect(numberFields(page).nth(0)).toHaveValue('5%');
  await expect(numberFields(page).nth(1)).toHaveValue(/EUR/);
  await openStory(page, 'sizes');
  await expect(numberFields(page)).toHaveCount(4);
  await openStory(page, 'stepper');
  await page.getByRole('button', { name: 'increment value' }).click();
  await expect(page.getByText('4', { exact: true })).toBeVisible();
  await openStory(page, 'element');
  await expect(page.locator('.leverui-input-group svg.lucide')).toBeVisible();
  await expect(numberFields(page)).toHaveCSS('padding-left', '40px');
  await openStory(page, 'scrubber');
  await expect(page.locator('[data-number-input-scrubber]')).toBeVisible();
  await expect(numberFields(page)).toHaveCSS('padding-left', '40px');
}

/** Check field help, invalid copy, and required form validation. */
async function verifiesFields({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'field');
  await expect(page.getByText('Enter a number between 1 and 10')).toBeVisible();
  await openStory(page, 'invalid');
  await expect(page.getByText('The entry is invalid')).toBeVisible();
  await openStory(page, 'hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Number is required')).toBeVisible();
  await numberFields(page).fill('7');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Number is required')).toHaveCount(0);
}

test('all Number Input examples render', verifiesInventory);
test('Number Input values and constraints work', verifiesNumericState);
test('Number Input formatting and adornments render', verifiesDisplay);
test('Number Input field and form states work', verifiesFields);
