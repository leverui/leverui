import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'controlled',
  'disabled',
  'controls',
  'double-click',
  'final-focus',
  'store',
  'textarea',
] as const;

/** Require all eight Editable stories to render their preview. */
async function verifiesEveryEditableExample({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-editable--${id}`);
    await expect(
      page.locator('#storybook-root [data-editable-preview]'),
      `Editable story ${id} should render a preview`,
    ).toBeAttached();
  }
}

/** Exercise default, controlled, and disabled editing behavior. */
async function verifiesEditableValues({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-editable--basic');
  await page.locator('[data-editable-preview]').click();
  const basicInput = page.locator('[data-editable-input]');
  await expect(basicInput).toBeVisible();
  await basicInput.fill('Updated name');
  await basicInput.press('Enter');
  await expect(page.locator('[data-editable-preview]')).toHaveText('Updated name');

  await page.goto('/iframe.html?id=components-editable--controlled');
  await page.locator('[data-editable-preview]').click();
  const controlledInput = page.locator('[data-editable-input]');
  await controlledInput.fill('Solid value');
  await controlledInput.press('Enter');
  await expect(page.locator('[data-editable-preview]')).toHaveText('Solid value');

  await page.goto('/iframe.html?id=components-editable--disabled');
  await page.locator('[data-editable-preview]').click();
  await expect(page.locator('[data-editable-input]')).not.toBeVisible();
}

/** Check icon controls, double-click activation, and textarea editing. */
async function verifiesEditableModes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-editable--controls');
  await page.getByRole('button', { name: 'edit', exact: true }).click();
  const controlInput = page.locator('[data-editable-input]');
  await controlInput.fill('Canceled value');
  await page.getByRole('button', { name: 'cancel', exact: true }).click();
  await expect(page.locator('[data-editable-preview]')).toHaveText('Click to edit');
  await page.getByRole('button', { name: 'edit', exact: true }).click();
  await controlInput.fill('Saved value');
  await page.getByRole('button', { name: 'submit', exact: true }).click();
  await expect(page.locator('[data-editable-preview]')).toHaveText('Saved value');

  await page.goto('/iframe.html?id=components-editable--double-click');
  await page.locator('[data-editable-preview]').click();
  await expect(page.locator('[data-editable-input]')).not.toBeVisible();
  await page.locator('[data-editable-preview]').dblclick();
  await expect(page.locator('[data-editable-input]')).toBeVisible();

  await page.goto('/iframe.html?id=components-editable--textarea');
  await page.locator('[data-editable-preview]').click();
  await expect(page.locator('#storybook-root textarea')).toBeVisible();
}

/** Check an external machine and the final focus target. */
async function verifiesEditableFocusAndStore({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-editable--store');
  await expect(page.locator('#storybook-root code')).toHaveText('not editing');
  await page.locator('[data-editable-preview]').click();
  await expect(page.locator('#storybook-root code')).toHaveText('editing');

  await page.goto('/iframe.html?id=components-editable--final-focus');
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.locator('[data-editable-input]').fill('A new value');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByPlaceholder('Focus moves here next')).toBeFocused();
}

test('all Editable examples render', verifiesEveryEditableExample);
test('Editable values and disabled state work', verifiesEditableValues);
test('Editable controls and activation modes work', verifiesEditableModes);
test('Editable store and final focus work', verifiesEditableFocusAndStore);
