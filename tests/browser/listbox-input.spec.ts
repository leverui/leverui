import { expect, test, type Page } from '@playwright/test';

/** Verify locale-aware filtering, empty state, and selection after reset. */
async function verifiesFilterGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-input--filter');
  const input = page.getByRole('textbox', { name: 'Filter frameworks' });
  const listbox = page.getByRole('listbox', { name: 'Select Framework' });
  const options = listbox.getByRole('option');
  await expect(options).toHaveCount(11, { timeout: 30_000 });
  await expect(input).toHaveClass(/leverui-input/);
  await input.fill('NUXT');
  await expect(options).toHaveCount(1);
  await expect(options.first()).toHaveAccessibleName('Nuxt.js');
  await input.fill('');
  await expect(options).toHaveCount(11);
  await input.fill('no matching framework');
  await expect(options).toHaveCount(0);
  // The primitive keeps the empty message in a status region beside the listbox.
  await expect(
    listbox.locator('xpath=..').getByRole('status').getByText('No frameworks found'),
  ).toBeVisible();
  await input.fill('');
  await expect(options).toHaveCount(11);
  await listbox.focus();
  await listbox.press('Home');
  await listbox.press('Enter');
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
}

test('Listbox input guide filters frameworks and recovers from empty state', verifiesFilterGuide);

/** Verify Home and End navigate options while the input retains its text. */
async function verifiesKeyboardPriority({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-input--keyboard-priority');
  const input = page.getByRole('textbox', { name: 'Navigate frameworks' });
  const listbox = page.getByRole('listbox', { name: 'Select framework' });
  const options = listbox.getByRole('option');
  await expect(options).toHaveCount(4, { timeout: 30_000 });
  await input.fill('test');
  await input.evaluate(
    /** Start away from both ends so native Home or End would move the caret. */
    (element: HTMLInputElement) => element.setSelectionRange(2, 2),
  );
  const firstId = await options.first().getAttribute('id');
  const lastId = await options.last().getAttribute('id');
  await input.press('End');
  await expect(options.last()).toHaveAttribute('data-highlighted');
  await expect(input).toHaveAttribute('aria-activedescendant', lastId ?? '');
  await expect(input).toHaveJSProperty('selectionStart', 2);
  await expect(input).toBeFocused();
  await input.press('Home');
  await expect(options.first()).toHaveAttribute('data-highlighted');
  await expect(input).toHaveAttribute('aria-activedescendant', firstId ?? '');
  await expect(input).toHaveJSProperty('selectionStart', 2);
  await expect(input).toBeFocused();
  await input.press('End');
  await input.press('Enter');
  await expect(options.last()).toHaveAttribute('aria-selected', 'true');
  await expect(input).toHaveValue('test');
}

test('Listbox keyboard-priority input navigates with Home and End', verifiesKeyboardPriority);
