import { expect, test, type Page } from '@playwright/test';

/** Open one Listbox gallery story. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-listbox--${id}`);
}

/** Verify the filter narrows options and recovers from an empty result. */
async function verifiesInputFiltering({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'input');
  const input = page.getByRole('textbox', { name: 'Filter fruits' });
  const options = page.getByRole('listbox', { name: 'Select fruit' }).getByRole('option');
  await expect(options).toHaveCount(10);
  await input.fill('MANG');
  await expect(options).toHaveCount(1);
  await expect(options.first()).toHaveAccessibleName('Mango');
  await input.fill('nothing matches');
  await expect(page.getByText('No fruits found')).toBeVisible();
}

/** Verify preview selection and transferring an item between collections. */
async function verifiesExplorerAndTransfer({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'image-explorer');
  await page.getByRole('option', { name: 'Breaking wave' }).click();
  await expect(page.getByRole('img', { name: 'Breaking wave' })).toBeVisible();

  await openStory(page, 'transfer-list');
  const available = page.getByRole('listbox', { name: 'Available characters' });
  const selected = page.getByRole('listbox', { name: 'Selected characters' });
  await available.getByRole('option', { name: 'Wren' }).click();
  await page.getByRole('button', { name: 'Move selected characters right' }).click();
  await expect(selected.getByRole('option', { name: 'Wren' })).toBeVisible();
}

/** Verify choosing a command dismisses the dialog. */
async function verifiesDialog({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'dialog');
  await page.getByRole('button', { name: 'Open search' }).click();
  const dialog = page.getByRole('dialog', { name: 'Search apps or commands' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('textbox', { name: 'Search apps or commands' }).fill('Notion');
  await dialog.getByRole('option', { name: /Notion/ }).click();
  await expect(dialog).toHaveCount(0);
}

/** Verify a Popover selection updates its trigger and closes the list. */
async function verifiesPopover({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'popover');
  await page.getByRole('button', { name: 'Select' }).click();
  await page.getByRole('option', { name: 'French' }).click();
  await expect(page.getByRole('button', { name: 'French' })).toBeVisible();
  await expect(page.getByRole('listbox', { name: 'Languages' })).toHaveCount(0);
}

test('Listbox input filters the collection', verifiesInputFiltering);
test('Listbox image explorer and transfer list update', verifiesExplorerAndTransfer);
test('Listbox dialog searches and closes after selection', verifiesDialog);
test('Listbox popover selection updates its trigger', verifiesPopover);
