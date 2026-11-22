import { expect, test, type Page } from '@playwright/test';
import {
  expectCollectionGuideActive,
  expectCollectionGuideOptions,
} from './listbox-collection-guide-contract';

/** Verify disabled options remain visible while pointer and keyboard skip them. */
async function verifiesDisabledGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-collection-guide--disabled');
  const listbox = page.getByRole('listbox', { name: 'Select framework' });
  const options = listbox.getByRole('option');
  await expectCollectionGuideOptions(options, 'disabled');
  await expect(options.nth(1)).toHaveAttribute('aria-disabled', 'true');
  await expect(options.nth(3)).toHaveAttribute('aria-disabled', 'true');
  await options.nth(1).click({ force: true });
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'false');
  await page.reload();
  await expectCollectionGuideOptions(options, 'disabled');
  await listbox.focus();
  await listbox.press('Home');
  await expectCollectionGuideActive(listbox, options.first());
  await listbox.press('ArrowDown');
  await expectCollectionGuideActive(listbox, options.nth(2));
  await listbox.press('Enter');
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'false');
  await expect(listbox).toBeFocused();
}

test('disabled Listbox guide skips unavailable options', verifiesDisabledGuide);

/** Verify category labels and navigation across a group boundary. */
async function verifiesGroupedGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-collection-guide--grouped');
  const listbox = page.getByRole('listbox', { name: 'Select media' });
  const options = listbox.getByRole('option');
  const groups = listbox.getByRole('group');
  await expectCollectionGuideOptions(options, 'grouped');
  await expect(groups).toHaveCount(2);
  await expect(groups.nth(0)).toHaveAccessibleName('Books');
  await expect(groups.nth(1)).toHaveAccessibleName('Movies');
  await expect(groups.nth(0).getByRole('option')).toHaveCount(3);
  await expect(groups.nth(1).getByRole('option')).toHaveCount(3);
  await listbox.focus();
  await listbox.press('Home');
  await listbox.press('ArrowDown');
  await listbox.press('ArrowDown');
  await listbox.press('ArrowDown');
  await expectCollectionGuideActive(listbox, options.nth(3));
  await listbox.press('Enter');
  await expect(options.nth(3)).toHaveAttribute('aria-selected', 'true');
  await options.nth(4).click();
  await expect(options.nth(4)).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(3)).toHaveAttribute('aria-selected', 'false');
}

test('grouped Listbox guide names categories and navigates across them', verifiesGroupedGuide);

/** Verify pointer and keyboard add or remove one value without losing others. */
async function verifiesMultipleGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-collection-guide--multiple');
  const listbox = page.getByRole('listbox', { name: 'Select frameworks (multiple)' });
  const options = listbox.getByRole('option');
  await expectCollectionGuideOptions(options, 'multiple');
  await expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
  await options.first().click();
  await options.nth(2).click();
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
  await listbox.focus();
  await listbox.press('End');
  await expectCollectionGuideActive(listbox, options.last());
  await listbox.press('Enter');
  await expect(options.last()).toHaveAttribute('aria-selected', 'true');
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
  await listbox.press('Enter');
  await expect(options.last()).toHaveAttribute('aria-selected', 'false');
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
  await options.nth(2).click();
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'false');
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(listbox).toBeFocused();
}

test('multiple Listbox guide adds and removes values independently', verifiesMultipleGuide);
