import { expect, test } from '@playwright/test';

/** Verify creating a label from Command's empty state refreshes results. */
test('Command empty state creates a new searchable label', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--empty-state');
  await page.getByRole('button', { name: 'Search labels...' }).click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox');
  await expect(dialog.getByRole('option')).toHaveCount(6);

  await input.fill('Urgent Review');
  await expect(dialog.getByRole('option')).toHaveCount(0);
  await expect(dialog.getByText('No labels found')).toBeVisible();
  await dialog.getByRole('button', { name: 'Create "Urgent Review"' }).click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('');
  await expect(dialog.getByRole('option')).toHaveCount(7);
  await expect(dialog.getByRole('option', { name: 'Urgent Review' })).toBeVisible();
});
