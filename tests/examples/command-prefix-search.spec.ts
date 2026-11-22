import { expect, test } from '@playwright/test';

/** Verify prefix keys change Command scope without entering query text. */
test('Command prefix search scopes and clears with Backspace', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--prefix-search');
  const trigger = page.getByRole('button', { name: 'Search everything...' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox');
  await expect(dialog.getByRole('option')).toHaveCount(9);

  await input.press('>');
  await expect(input).toHaveValue('');
  await expect(dialog.getByRole('option')).toHaveCount(3);
  await expect(dialog.getByRole('group', { name: 'Commands' })).toBeVisible();
  await input.press('Backspace');
  await expect(dialog.getByRole('option')).toHaveCount(9);

  await input.press('@');
  await expect(dialog.getByRole('option')).toHaveCount(3);
  await expect(dialog.getByRole('option', { name: /Lena Ortiz/ })).toBeVisible();
  await input.press('Escape');
  await expect(dialog).toHaveCount(0);
  await trigger.click();
  await expect(dialog.getByRole('option')).toHaveCount(9);
});
