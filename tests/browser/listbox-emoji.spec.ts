import { expect, test, type Page } from '@playwright/test';

/** Exercise grid navigation, selection, and live case-insensitive filtering. */
async function verifiesEmojiGrid({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-emoji-grid--guide');
  const grid = page.getByTestId('emoji-grid');
  const options = grid.getByRole('option');
  await expect(options).toHaveCount(200, { timeout: 30_000 });

  const first = options.first();
  await grid.focus();
  await grid.press('Home');
  await expect(first).toHaveAttribute('data-highlighted');
  await grid.press('ArrowRight');
  await expect(options.nth(1)).toHaveAttribute('data-highlighted');
  await options.nth(1).press('Enter');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('selected-emoji')).toContainText('😃');
  await grid.press('Home');
  await grid.press('ArrowDown');
  await expect(options.nth(8)).toHaveAttribute('data-highlighted');
  await grid.press('ArrowRight');
  await expect(options.nth(9)).toHaveAttribute('data-highlighted');

  const filter = page.getByRole('textbox', { name: 'Filter emojis' });
  await expect(filter).toHaveClass(/lui-input/);
  await filter.fill('GRINNING FACE');
  await expect(options).toHaveCount(4);
  await expect(grid.getByRole('option', { name: 'grinning face', exact: true })).toBeVisible();
  await filter.fill('GRINNING FACE WITH SWEAT');
  await expect(options).toHaveCount(1);
  await filter.press('ArrowDown');
  await filter.press('Enter');
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('selected-emoji')).toContainText('😅');
  await filter.fill('no emoji matches this');
  await expect(options).toHaveCount(0);
}

test('Listbox emoji guide preserves eight-column selection and filtering', verifiesEmojiGrid);
