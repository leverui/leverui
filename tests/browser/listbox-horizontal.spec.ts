import { expect, test, type Page } from '@playwright/test';
import { expectHorizontalEndReachable } from './listbox-horizontal-contract';

const expectedAlbums = [
  ['Red Morning', 'Ada Linden', 'red-morning', '/demo-images/scenes/cover-1.webp'],
  ['Violet Hour', 'Night Ferry', 'violet-hour', '/demo-images/scenes/cover-2.webp'],
  ['Distant Light', 'The Far Field', 'distant-light', '/demo-images/scenes/cover-3.webp'],
  ['Slow Tide', 'Blue Harbor', 'slow-tide', '/demo-images/scenes/cover-4.webp'],
  ['Signal Lines', 'Paper Circuit', 'signal-lines', '/demo-images/scenes/cover-5.webp'],
] as const;

/** Verify card content and the horizontal Listbox's arrow-key selection. */
async function verifiesHorizontalGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-horizontal--guide');
  const listbox = page.getByRole('listbox', { name: 'Select Album' });
  const options = listbox.getByRole('option');
  await expect(listbox).toHaveAttribute('data-orientation', 'horizontal');
  await expect(options).toHaveCount(expectedAlbums.length);
  for (const [index, [title, artist, value, photo]] of expectedAlbums.entries()) {
    const option = options.nth(index);
    await expect(option).toHaveAttribute('data-value', value);
    await expect(option).toContainText(title);
    await expect(option).toContainText(artist);
    const image = option.getByRole('img', { name: title });
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('src', photo);
  }

  await listbox.focus();
  await listbox.press('Home');
  await expect(options.first()).toHaveAttribute('data-highlighted');
  await listbox.press('ArrowRight');
  await expect(options.nth(1)).toHaveAttribute('data-highlighted');
  await listbox.press('ArrowRight');
  await expect(options.nth(2)).toHaveAttribute('data-highlighted');
  await listbox.press('ArrowLeft');
  await expect(options.nth(1)).toHaveAttribute('data-highlighted');
  await listbox.press('Enter');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await listbox.press('ArrowRight');
  await listbox.press('ArrowRight');
  await listbox.press('ArrowRight');
  await expectHorizontalEndReachable(listbox, options.last());
  await listbox.press('Enter');
  await expect(options.last()).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'false');
  await options.nth(2).click();
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(options.last()).toHaveAttribute('aria-selected', 'false');
  await expect(listbox).toBeFocused();
}

test('horizontal Listbox guide presents albums and navigates sideways', verifiesHorizontalGuide);
