import { expect, test } from '@playwright/test';

/** Verify search failure, retry, and selection against the local people source. */
test('Command async content retries a failed people search', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--async-content');
  await page.getByRole('button', { name: 'Search people...' }).click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox');
  // The simulated request fails while the browser is offline.
  await page.context().setOffline(true);
  await input.fill('Priya');
  await expect(dialog.getByRole('alert').filter({ hasText: 'Search failed' })).toBeVisible();

  await page.context().setOffline(false);
  await dialog.getByRole('button', { name: 'Try again' }).click();
  await expect(dialog.getByRole('option', { name: /Priya Raman/ })).toBeVisible();
  await expect(dialog.getByText('Product designer')).toBeVisible();
  await dialog.getByRole('option', { name: /Priya Raman/ }).click();
  await expect(dialog).toHaveCount(0);
});
