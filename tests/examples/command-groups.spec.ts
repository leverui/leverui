import { expect, test } from '@playwright/test';

/** Verify hosted Groups content and ranked sections in the browser. */
test('grouped Command filters eleven actions across three sections', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--groups');
  await page.getByRole('button', { name: 'Search...' }).click();

  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  await expect(dialog.getByRole('group')).toHaveCount(3);
  await expect(dialog.getByRole('option')).toHaveCount(11);
  await expect(dialog.getByRole('group', { name: 'Issues' }).getByRole('option')).toHaveCount(5);

  const input = dialog.getByRole('combobox');
  await input.fill('theme');
  await expect(dialog.getByRole('group', { name: 'View' })).toBeVisible();
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await expect(dialog.getByRole('option', { name: /Switch theme/ }).locator('mark')).toHaveText(
    'theme',
  );
});
