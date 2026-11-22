import { expect, test, type Page } from '@playwright/test';

/** Verify a modal Listbox filters, selects, closes, and restores trigger focus. */
async function verifiesDialogListbox({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-overlay--dialog-composition');
  const trigger = page.getByTestId('dialog-listbox-trigger');
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Search apps or commands' });
  await expect(dialog).toBeVisible({ timeout: 30_000 });
  const listbox = dialog.getByRole('listbox', { name: 'Search results' });
  await expect(listbox).toBeVisible();
  await expect(dialog.locator('kbd')).toHaveCount(3);
  await expect(listbox.getByRole('option')).toHaveCount(10);
  await expect(listbox.getByRole('group', { name: 'applications' })).toBeVisible();
  await expect(listbox.getByRole('group', { name: 'commands' })).toBeVisible();
  const search = dialog.getByRole('textbox', { name: 'Search apps or commands' });
  await expect(search).toBeFocused();
  await search.fill('Notíon');
  await expect(listbox.getByRole('option')).toHaveCount(1);
  await expect(listbox.getByRole('option', { name: 'Notion applications' })).toHaveAttribute(
    'data-highlighted',
    '',
  );
  await search.press('Enter');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByTestId('dialog-listbox-value')).toHaveText('notion');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(listbox.getByRole('option')).toHaveCount(10);
  await listbox.getByRole('option', { name: 'Linear.app applications' }).click();
  await expect(page.getByTestId('dialog-listbox-value')).toHaveText('linear');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(listbox.getByRole('option')).toHaveCount(10);
  await expect(search).toBeFocused();
  await search.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
}

test('Listbox composes with Dialog selection and focus return', verifiesDialogListbox);

/** Let a newer focus decision win while Dialog finishes its exit. */
async function verifiesFocusMovedDuringExit({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-overlay--dialog-composition');
  await page.getByTestId('dialog-listbox-trigger').click();
  const dialog = page.getByRole('dialog', { name: 'Search apps or commands' });
  await dialog.getByRole('textbox', { name: 'Search apps or commands' }).press('Escape');
  await expect(dialog).not.toBeVisible();
  const other = page.getByTestId('dialog-listbox-other-focus');
  await other.focus();
  await expect(dialog).toHaveCount(0);
  await expect(other).toBeFocused();
}

test('Dialog exit does not steal later focus from another action', verifiesFocusMovedDuringExit);

/** Verify a Popover Listbox preserves selection across dismissal and reopening. */
async function verifiesPopoverListbox({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-overlay--popover-composition');
  const trigger = page.getByTestId('popover-listbox-trigger');
  await expect(trigger.locator('svg[aria-hidden="true"]')).toHaveCount(1);
  await trigger.click();
  const listbox = page.getByRole('listbox', { name: 'Frameworks' });
  await expect(listbox).toBeVisible({ timeout: 30_000 });
  const search = page.getByRole('textbox', { name: 'Search frameworks' });
  await expect(listbox.getByRole('option')).toHaveCount(7);
  await search.fill('Vuê');
  await expect(listbox.getByRole('option')).toHaveCount(1);
  await search.press('ArrowDown');
  await search.press('Enter');
  await expect(listbox).not.toBeVisible();
  await expect(page.getByTestId('popover-listbox-value')).toHaveText('vue');
  await expect(trigger).toHaveText('Vue.js');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(search).toHaveValue('');
  await expect(listbox.getByRole('option')).toHaveCount(7);
  await expect(listbox.getByRole('option', { name: 'Vue.js' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('Escape');
  await expect(listbox).not.toBeVisible();
  await expect(trigger).toBeFocused();
}

test('Listbox composes with Popover filtering and retained value', verifiesPopoverListbox);
