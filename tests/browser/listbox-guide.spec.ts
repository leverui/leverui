import { expect, test, type Page } from '@playwright/test';
import { expectGuideOptions } from './listbox-guide-contract';
import {
  alignGuidePlatform,
  expectGuidePlatformCapabilities,
  guideModifier,
} from './listbox-guide-platform';

/** Verify modifier and range selection through real option interactions. */
async function verifiesExtendedSelection({ page }: { page: Page }): Promise<void> {
  await alignGuidePlatform(page);
  await page.goto('/iframe.html?id=components-listbox-guide--extended');
  const listbox = page.getByRole('listbox', { name: /Select frameworks \(hold/ });
  const options = listbox.getByRole('option');
  await expect(page.locator('kbd')).toHaveText(['⌘', '^']);
  await expectGuideOptions(options, 'extended');
  await expectGuidePlatformCapabilities(page);
  await options.nth(0).click();
  await expect(options.nth(0)).toHaveAttribute('aria-selected', 'true');
  await options.nth(2).click({ modifiers: [await guideModifier(page)] });
  await expect(options.nth(0)).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(listbox).toBeFocused();
  await options.nth(3).click({ modifiers: ['Shift'] });
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(3)).toHaveAttribute('aria-selected', 'true');
  await listbox.press('Home');
  await expect(options.nth(0)).toHaveAttribute('data-highlighted');
  await expect(listbox).toHaveAttribute(
    'aria-activedescendant',
    (await options.nth(0).getAttribute('id')) ?? '',
  );
  await listbox.press('ArrowDown');
  await expect(options.nth(1)).toHaveAttribute('data-highlighted');
  await expect(listbox).toHaveAttribute(
    'aria-activedescendant',
    (await options.nth(1).getAttribute('id')) ?? '',
  );
  await expect(listbox).toBeFocused();
}

test('Listbox supports extended modifier and range selection', verifiesExtendedSelection);

/** Verify the guide's select-all header updates every option and mixed state. */
async function verifiesSelectAll({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-guide--select-all');
  const listbox = page.getByRole('listbox', { name: 'Select Frameworks' });
  const header = page.getByRole('button', { name: 'Select Frameworks' });
  const options = listbox.getByRole('option');
  await expect(header).toHaveAttribute('type', 'button');
  await expectGuideOptions(options, 'select-all');
  await expect(header.locator('svg')).toHaveAttribute('data-state', 'unchecked');
  await expect(header).toHaveAttribute('aria-pressed', 'false');
  await header.click();
  await expect(header).toHaveAttribute('aria-pressed', 'true');
  await expect(header.locator('svg')).toHaveAttribute('data-state', 'checked');
  for (const option of await options.all())
    await expect(option).toHaveAttribute('aria-selected', 'true');
  await expect(options.last().locator('svg')).toHaveAttribute('data-state', 'checked');
  await options.nth(0).click();
  await expect(header).toHaveAttribute('aria-pressed', 'mixed');
  await expect(header.locator('[data-state="indeterminate"]')).toHaveCount(1);
  await header.click();
  await expect(header).toHaveAttribute('aria-pressed', 'true');
  await header.focus();
  await header.press('Space');
  await expect(header.locator('svg')).toHaveAttribute('data-state', 'unchecked');
  for (const option of await options.all())
    await expect(option).toHaveAttribute('aria-selected', 'false');
  await expect(header).toHaveAttribute('aria-pressed', 'false');
  await listbox.focus();
  await listbox.press('Home');
  await expect(options.first()).toHaveAttribute('data-highlighted');
  await expect(listbox).toHaveAttribute(
    'aria-activedescendant',
    (await options.first().getAttribute('id')) ?? '',
  );
  await listbox.press('Enter');
  await listbox.press('ArrowDown');
  await expect(options.nth(1)).toHaveAttribute('data-highlighted');
  await listbox.press('Shift+ArrowDown');
  await expect(options.nth(2)).toHaveAttribute('data-highlighted');
  await expect(listbox).toHaveAttribute(
    'aria-activedescendant',
    (await options.nth(2).getAttribute('id')) ?? '',
  );
  await expect(listbox).toBeFocused();
  // Zag 2 selects the range from the anchor, the option chosen with Enter,
  // through the newly highlighted option.
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
}

test('Listbox select-all toggles complete and mixed selections', verifiesSelectAll);
