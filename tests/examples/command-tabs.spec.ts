import { expect, test } from '@playwright/test';

/** Verify tabs scope the live Command collection and reset after closing. */
test('Command tabs filter categories and reopen on All', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--tabs');
  const trigger = page.getByRole('button', { name: 'Search apps, actions and people...' });
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  await expect(dialog.getByRole('option')).toHaveCount(8);
  await dialog.getByRole('tab', { name: 'People' }).click();
  await expect(dialog.getByRole('option')).toHaveCount(2);
  await expect(dialog.getByRole('option', { name: /Mara Ellison/ })).toBeVisible();

  await dialog.getByRole('combobox').press('Escape');
  await expect(dialog).toHaveCount(0);
  await trigger.click();
  await expect(dialog.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
  await expect(dialog.getByRole('option')).toHaveCount(8);
});
