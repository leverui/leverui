import { expect, test } from '@playwright/test';

/** Verify a caller-owned Command machine responds to the shortcut and search. */
test('root provider opens by keyboard and reports live input', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--root-provider');
  await expect(page.getByRole('button', { name: /Search commands/ })).toBeVisible();
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  await expect(dialog.getByRole('option')).toHaveCount(6);

  await input.fill('save');
  await expect(page.getByText('Last search: save')).toBeVisible();
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await dialog.getByRole('option', { name: /Save file/ }).click();
  await expect(dialog).toHaveCount(0);
});
