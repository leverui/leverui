import { expect, test } from '@playwright/test';

/** Verify the hosted multiple-label Command keeps the dialog open on selection. */
test('Command toggles labels without closing the dialog', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--multiple');
  await expect(page.getByText('Bug', { exact: true })).toHaveCount(1);
  await expect(page.getByText('Accessibility', { exact: true })).toHaveCount(1);
  await page.getByRole('button', { name: 'Add labels...' }).click();

  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  await expect(dialog.getByRole('option')).toHaveCount(8);
  await dialog.getByRole('option', { name: 'Feature' }).click();
  await expect(dialog).toBeVisible();
  await expect(page.getByText('Feature', { exact: true })).toHaveCount(2);

  await dialog.getByRole('option', { name: 'Bug' }).click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('combobox').press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('Bug', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Feature', { exact: true })).toHaveCount(1);
});
