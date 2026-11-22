import { expect, test, type Page } from '@playwright/test';

/** Check that option checkmarks follow the Listbox machine's selection. */
async function verifiesCheckmarks({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-presentation--checkmark');
  const listbox = page.getByRole('listbox', { name: 'Select frameworks (with checkmarks)' });
  const options = listbox.getByRole('option');
  await expect(options).toHaveCount(7, { timeout: 30_000 });
  const react = options.getByText('React.js').locator('..');
  const vue = options.getByText('Vue.js').locator('..');
  await listbox.focus();
  await listbox.press('Home');
  await expect(react).toHaveAttribute('data-highlighted');
  await listbox.press('Enter');
  await listbox.press('ArrowDown');
  await expect(vue).toHaveAttribute('data-highlighted');
  await listbox.press('Enter');
  await expect(react).toHaveAttribute('aria-selected', 'true');
  await expect(vue).toHaveAttribute('aria-selected', 'true');
  await expect(react.locator('svg')).toHaveAttribute('data-state', 'checked');
  await expect(vue.locator('svg')).toHaveAttribute('data-state', 'checked');
  await listbox.press('Home');
  await listbox.press('Enter');
  await expect(react.locator('svg')).toHaveAttribute('data-state', 'unchecked');
  await expect(vue.locator('svg')).toHaveAttribute('data-state', 'checked');
}

test('Listbox checkmark guide keeps markers in sync with multiple selection', verifiesCheckmarks);

/** Verify supporting text remains inside each option and selection still works. */
async function verifiesDescriptions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-presentation--description');
  const listbox = page.getByRole('listbox', { name: 'Select framework' });
  const options = listbox.getByRole('option');
  await expect(options).toHaveCount(6, { timeout: 30_000 });
  const react = options.filter({ hasText: 'React.js' });
  await expect(react).toContainText('A JavaScript library for building user interfaces');
  await listbox.focus();
  await listbox.press('Home');
  await expect(react).toHaveAttribute('data-highlighted');
  await listbox.press('ArrowDown');
  const vue = options.filter({ hasText: 'Vue.js' });
  await expect(vue).toHaveAttribute('data-highlighted');
  await listbox.press('Enter');
  await expect(vue).toHaveAttribute('aria-selected', 'true');
  await expect(react).toContainText('A JavaScript library for building user interfaces');
  await expect(options.filter({ hasText: 'The progressive JavaScript framework' })).toHaveCount(1);
}

test('Listbox description guide keeps supporting copy with its option', verifiesDescriptions);

/** Keep decorative icons silent while option labels remain available. */
async function verifiesIcons({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-presentation--icon');
  const listbox = page.getByRole('listbox', { name: 'Select framework' });
  const options = listbox.getByRole('option');
  await expect(options).toHaveCount(5, { timeout: 30_000 });
  const react = listbox.getByRole('option', { name: 'React.js' });
  await expect(react.locator('[data-icon="atom"]')).toHaveAttribute('aria-hidden', 'true');
  await expect(listbox.locator('[data-icon]')).toHaveCount(5);
  await listbox.focus();
  await listbox.press('Home');
  await expect(react).toHaveAttribute('data-highlighted');
  await listbox.press('ArrowDown');
  await expect(options.nth(1)).toHaveAttribute('data-highlighted');
  await listbox.press('ArrowUp');
  await listbox.press('Enter');
  await expect(react).toHaveAttribute('aria-selected', 'true');
}

test('Listbox icon guide preserves accessible labels and decorative icons', verifiesIcons);
