import { expect, test } from '@playwright/test';

/** Verify the footer action follows the highlighted search result. */
test('Command footer changes between app and action verbs', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--footer-actions');
  await page.getByRole('button', { name: 'Search apps and commands...' }).click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox');
  await expect(dialog.getByRole('option')).toHaveCount(6);

  await input.fill('figma');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await expect(dialog.getByText('Open application', { exact: true })).toBeVisible();

  await input.fill('calculator');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await expect(dialog.getByText('Run command', { exact: true })).toBeVisible();
});
