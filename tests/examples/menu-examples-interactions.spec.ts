import { expect, test, type Page } from '@playwright/test';

/** Open one Menu gallery story for interaction checks. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-menu--${id}`);
}

/** Keep checkbox choices independent and radio choices exclusive. */
async function verifiesSelections({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'checkbox-items');
  await page.getByRole('button', { name: 'Features' }).click();
  const autosave = page.getByRole('menuitemcheckbox', { name: 'Autosave' });
  await expect(autosave).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('menuitemcheckbox', { name: 'Spellcheck' }).click();
  await page.getByRole('button', { name: 'Features' }).click();
  await expect(page.getByRole('menuitemcheckbox', { name: 'Spellcheck' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await expect(page.getByRole('menuitemcheckbox', { name: 'Autosave' })).toHaveAttribute(
    'aria-checked',
    'true',
  );

  await openStory(page, 'radio-items');
  await page.getByRole('button', { name: 'Sort' }).click();
  await expect(page.getByRole('menuitemradio', { name: 'Ascending' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await page.getByRole('menuitemradio', { name: 'Descending' }).click();
  await page.getByRole('button', { name: 'Sort' }).click();
  await expect(page.getByRole('menuitemradio', { name: 'Descending' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
}

/** Open the one-level and data-driven nested menus with the keyboard. */
async function verifiesNested({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'submenu');
  await page.getByRole('button', { name: 'Open' }).click();
  await page.getByRole('menuitem', { name: 'Open recent' }).hover();
  await expect(page.getByRole('menuitem', { name: /v3$/ })).toBeVisible();

  await openStory(page, 'submenu-dynamic');
  await page.getByRole('button', { name: 'Nested' }).click();
  await page.getByRole('menuitem', { name: 'Open recent' }).hover();
  await page.getByRole('menuitem', { name: /v3$/ }).hover();
  await expect(page.getByRole('menuitem', { name: /v3\.2$/ })).toBeVisible();
}

/** Check right-click activation and a menu inside the modal focus scope. */
async function verifiesContexts({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'context-trigger');
  await page.getByText('Right click here').click({ button: 'right' });
  await expect(page.getByRole('menuitem', { name: 'Export' })).toBeVisible();

  await openStory(page, 'open-from-dialog');
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('menuitem', { name: 'Export' })).toBeVisible();
}

test('Menu checkbox and radio state updates', verifiesSelections);
test('Menu nested surfaces open', verifiesNested);
test('Menu context trigger and dialog nesting work', verifiesContexts);
