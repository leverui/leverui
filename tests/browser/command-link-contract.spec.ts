import { expect, test } from '@playwright/test';

/** Verify a Command option preserves anchor semantics for pointer activation. */
test('Command link opens its native destination from a pointer click', async ({ page }) => {
  await page.goto('/iframe.html?id=contracts-command-links--contract');
  await page.getByRole('button', { name: 'Search documentation...' }).click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox', { name: 'Command palette' });
  await expect(input).toHaveAttribute('placeholder', 'Search documentation...');
  const titleId = await dialog.locator('h2').getAttribute('id');
  if (!titleId) throw new Error('Command palette title is missing its id.');
  await expect(input).toHaveAttribute('aria-labelledby', titleId);
  await expect(dialog.getByRole('listbox', { name: 'Command palette' })).toBeVisible();
  await expect(dialog.getByRole('group', { name: 'Resources' })).toHaveCSS('margin-top', '6px');
  const options = dialog.getByRole('option');
  await expect(options).toHaveCount(6);
  for (const option of await options.all()) {
    await expect(option.locator('svg')).toHaveCount(2);
  }
  const link = dialog.getByRole('option', { name: 'Getting started' });
  await expect(link).toHaveAttribute('href', /contracts-command-links--local-target/);
  await expect(link).toHaveAttribute('target', '_blank');
  const popupPromise = page.waitForEvent('popup');
  await link.click();
  const popup = await popupPromise;
  await expect(popup.getByText('Destination opened')).toBeVisible();
});

/** Verify Enter on the Command input activates a highlighted link. */
test('Command link opens its destination from keyboard selection', async ({ page }) => {
  await page.goto('/iframe.html?id=contracts-command-links--contract');
  await page.getByRole('button', { name: 'Search documentation...' }).click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox');
  await input.fill('Theming');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  const popupPromise = page.waitForEvent('popup', { timeout: 10_000 });
  await input.press('Enter');
  const popup = await popupPromise;
  await expect(popup.getByText('Destination opened')).toBeVisible();
});
