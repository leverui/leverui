import { expect, test, type Locator, type Page } from '@playwright/test';
import { expectGuideOptions } from './listbox-guide-contract';

/** Require a real highlighted option ID linked to the focused listbox. */
async function expectActiveOption(listbox: Locator, option: Locator): Promise<void> {
  await expect(option).toHaveAttribute('data-highlighted');
  await expect(option).toHaveAttribute('id', /.+/);
  await expect(listbox).toHaveAttribute(
    'aria-activedescendant',
    (await option.getAttribute('id')) ?? '',
  );
}

/** Verify the basic root exposes the options and keyboard selection. */
async function verifiesBasicGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-state-guide--basic');
  const listbox = page.getByRole('listbox', { name: 'Select framework' });
  const options = listbox.getByRole('option');
  await expectGuideOptions(options, 'extended');
  await listbox.focus();
  await listbox.press('Home');
  await expectActiveOption(listbox, options.first());
  await listbox.press('ArrowDown');
  await expectActiveOption(listbox, options.nth(1));
  await listbox.press('Enter');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(options.first()).toHaveAttribute('aria-selected', 'false');
  await expect(listbox).toBeFocused();
}

test('basic Listbox guide preserves the options and keyboard use', verifiesBasicGuide);

/** Verify a caller-owned Solid signal receives each controlled selection. */
async function verifiesControlledGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-state-guide--controlled');
  const listbox = page.getByRole('listbox', { name: 'Select framework' });
  const options = listbox.getByRole('option');
  const readout = page.getByTestId('listbox-state-value');
  await expectGuideOptions(options, 'extended');
  await expect(readout).toContainText('[]');
  await options.first().click();
  await expect(readout).toContainText('"react"');
  await options.nth(2).click();
  await expect(options.first()).toHaveAttribute('aria-selected', 'false');
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(readout).toContainText('"angular"');
  await expect(readout).not.toContainText('"react"');
  await listbox.focus();
  await listbox.press('Home');
  await expectActiveOption(listbox, options.first());
  await listbox.press('ArrowDown');
  await expectActiveOption(listbox, options.nth(1));
  await listbox.press('Enter');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'false');
  await expect(readout).toContainText('"vue"');
  await expect(readout).not.toContainText('"angular"');
  await expect(listbox).toBeFocused();
}

test('controlled Listbox guide keeps its Solid value in sync', verifiesControlledGuide);

/** Verify RootProvider and the external store share one reactive selection. */
async function verifiesStoreGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-state-guide--store');
  const listbox = page.getByRole('listbox', { name: 'Select framework' });
  const options = listbox.getByRole('option');
  const readout = page.getByTestId('listbox-state-value');
  await expectGuideOptions(options, 'extended');
  await expect(readout).toContainText('[]');
  await options.nth(3).click();
  await expect(options.nth(3)).toHaveAttribute('aria-selected', 'true');
  await expect(readout).toContainText('"svelte"');
  await options.nth(1).click();
  await expect(options.nth(3)).toHaveAttribute('aria-selected', 'false');
  await expect(readout).toContainText('"vue"');
  await listbox.focus();
  await listbox.press('End');
  await expectActiveOption(listbox, options.nth(3));
  await listbox.press('Enter');
  await expect(options.nth(3)).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'false');
  await expect(readout).toContainText('"svelte"');
  await expect(readout).not.toContainText('"vue"');
  await expect(listbox).toBeFocused();
}

test('external Listbox store updates RootProvider and the readout', verifiesStoreGuide);
