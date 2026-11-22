import { expect, test } from '@playwright/test';

/** Verify the people and product catalog pages can be entered and left. */
test('Command async pages load each catalog and return to root', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--async-pages');
  await page.getByRole('button', { name: 'Search...', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox');
  await expect(dialog.getByRole('option')).toHaveCount(4);

  await dialog.getByRole('option', { name: /Search people/ }).click();
  await expect(input).toHaveAttribute('placeholder', 'Search people by name...');
  await expect(dialog.getByRole('option', { name: /Priya Raman/ })).toBeVisible();
  await expect(dialog.getByRole('option')).toHaveCount(8);
  await input.press('Escape');
  await expect(dialog.getByRole('option')).toHaveCount(4);

  await dialog.getByRole('option', { name: /Search products/ }).click();
  await expect(input).toHaveAttribute('placeholder', 'Search products...');
  await expect(dialog.getByRole('option', { name: /Canvas notebook/ })).toBeVisible();
  await input.fill('kettle');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await expect(dialog.getByRole('option', { name: /Copper kettle/ })).toBeVisible();
});
