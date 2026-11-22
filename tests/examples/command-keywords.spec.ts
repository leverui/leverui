import { expect, test } from '@playwright/test';

/** Verify alias search and descriptions in the hosted Keywords example. */
test('Command finds actions by aliases that are absent from labels', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--keywords');
  await page.getByRole('button', { name: 'Search workspace...' }).click();

  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox');
  await expect(dialog.getByRole('option')).toHaveCount(4);
  await input.fill('preferences');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await expect(dialog.getByRole('option', { name: /Open settings/ })).toContainText(
    'Configure your editor and account',
  );

  await input.fill('merge request');
  await expect(dialog.getByRole('group', { name: 'Git' })).toBeVisible();
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await expect(dialog.getByRole('option', { name: /Create pull request/ })).toBeVisible();
});
