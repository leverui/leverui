import { expect, test, type Page } from '@playwright/test';

const stories = [
  'basic',
  'controlled',
  'disabled-item',
  'extended-select',
  'grouped',
  'horizontal',
  'image-explorer',
  'multiselect',
  'select-all',
  'transfer-list',
  'virtualized',
  'checkmark',
  'description',
  'dialog',
  'emoji-grid',
  'icon',
  'input',
  'keyboard-priority',
  'popover',
  'store',
] as const;

/** Open a named Listbox example in its gallery canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-listbox--${id}`);
}

/** Verify every example mounts its intended surface. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of stories) {
    await openStory(page, id);
    if (id === 'dialog') {
      await expect(page.getByRole('button', { name: 'Open search' })).toBeVisible();
    } else if (id === 'popover') {
      await expect(page.getByRole('button', { name: 'Select' })).toBeVisible();
    } else {
      await expect(page.locator('[data-listbox-root]')).not.toHaveCount(0);
    }
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Check the four basic options and disabled collection flags. */
async function verifiesBasicAndDisabled({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  await expect(page.locator('[data-listbox-item]')).toHaveCount(4);
  await page.getByRole('option', { name: 'Starter' }).click();
  await expect(page.getByRole('option', { name: 'Starter' })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  await openStory(page, 'disabled-item');
  await expect(page.getByRole('option', { name: 'Medium' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(page.getByRole('option', { name: 'Extra large' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
}

/** Exercise select-all behavior and the horizontally oriented album cards. */
async function verifiesSelectionVariations({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'select-all');
  await page.getByTestId('listbox-select-all').click();
  await expect(page.locator('[data-listbox-item][aria-selected="true"]')).toHaveCount(10);
  await page.getByTestId('listbox-select-all').click();
  await expect(page.locator('[data-listbox-item][aria-selected="true"]')).toHaveCount(0);

  await openStory(page, 'horizontal');
  await expect(page.locator('[data-listbox-item]')).toHaveCount(5);
  await expect(page.locator('[data-listbox-root]')).toHaveAttribute(
    'data-orientation',
    'horizontal',
  );
}

/** Check the emoji grid's order across the first changed dataset position. */
async function verifiesEmojiOrder({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'emoji-grid');
  const options = page.getByRole('listbox', { name: 'Emojis' }).getByRole('option');
  await expect(options).toHaveCount(200);
  await expect(options.nth(10)).toHaveAttribute('data-value', '1FAE0');
  await expect(options.nth(11)).toHaveAttribute('data-value', '1F609');
  await expect(options.nth(199)).toHaveAttribute('data-value', '1F44E');
}

test('all Listbox examples render', verifiesInventory);
test('Listbox basic selection and disabled states work', verifiesBasicAndDisabled);
test('Listbox select-all and horizontal modes work', verifiesSelectionVariations);
test('Listbox emoji grid preserves the order', verifiesEmojiOrder);
