import { expect, test, type Page } from '@playwright/test';

/** Verify grouped filtering, icons, selection, and empty Explorer results. */
async function verifiesExplorerGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-explorer--guide');
  const listbox = page.getByRole('listbox', { name: 'Select item' });
  const options = listbox.getByRole('option');
  const input = page.getByPlaceholder('Type to filter...');
  await expect(options).toHaveCount(9);
  await expect(listbox.getByRole('group', { name: 'JavaScript' })).toBeVisible();
  await expect(listbox.getByRole('group', { name: 'Books' })).toBeVisible();
  await expect(listbox.getByRole('group', { name: 'Movies' })).toBeVisible();
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(options.first()).toHaveAttribute('data-value', 'react');
  await expect(listbox.locator('svg[data-icon][aria-hidden="true"]')).toHaveCount(5);
  await expect(options.first()).toHaveAccessibleName('React.js');

  await input.fill('LANT');
  await expect(options).toHaveCount(1);
  await expect(listbox.getByRole('group', { name: 'Books' })).toBeVisible();
  await expect(options.first()).toHaveAccessibleName('Lanternwright');
  await listbox.focus();
  await listbox.press('Home');
  await listbox.press('Enter');
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await input.fill('');
  await expect(options).toHaveCount(9);
  await expect(listbox.getByRole('option', { name: 'Lanternwright' })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  await input.fill('no matching item');
  await expect(options).toHaveCount(0);
  // The primitive keeps the empty message in a status region beside the listbox.
  await expect(
    listbox.locator('xpath=..').getByRole('status').getByText('No results found'),
  ).toBeVisible();
}

test('Listbox Explorer groups and filters the records', verifiesExplorerGuide);
