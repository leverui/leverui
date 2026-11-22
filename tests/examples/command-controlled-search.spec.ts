import { expect, test } from '@playwright/test';

/** Verify caller-controlled Command search through buttons and dialog input. */
test('controlled Command search reflects suggestions and typing', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--controlled-search');

  await expect(page.getByText('Query: empty')).toBeVisible();
  await page.getByRole('button', { name: 'theme' }).click();
  await expect(page.getByText('Query: theme')).toBeVisible();

  await page.getByRole('button', { name: 'theme', exact: true }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox');
  await expect(input).toHaveValue('theme');
  await expect(dialog.getByRole('option')).toHaveCount(1);

  await input.fill('settings');
  await expect(page.getByText('Query: settings')).toBeVisible();
  await expect(dialog.getByRole('option')).toHaveCount(2);
  await dialog.getByRole('option', { name: /Open settings/ }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: /settings/ }).first()).toBeVisible();
});
