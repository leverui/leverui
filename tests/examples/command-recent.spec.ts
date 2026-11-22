import { expect, test } from '@playwright/test';

/** Verify recent actions persist and disappear while the user searches. */
test('Command remembers a selected action across page reload', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--recent-commands');
  await page.evaluate(
    /** Start this browser check without a previous history. */
    () => localStorage.removeItem('leverui-command-recent'),
  );
  await page.reload();
  const trigger = page.getByRole('button', { name: 'Search commands...' });
  await trigger.click();
  let dialog = page.getByRole('dialog', { name: 'Command palette' });
  await expect(dialog.getByRole('option')).toHaveCount(7);
  await dialog.getByRole('option', { name: /Save file/ }).click();
  await expect(dialog).toHaveCount(0);

  await page.reload();
  await trigger.click();
  dialog = page.getByRole('dialog', { name: 'Command palette' });
  await expect(dialog.getByRole('group', { name: 'Recent' }).getByRole('option')).toHaveCount(1);
  await expect(dialog.getByRole('option')).toHaveCount(8);
  await dialog.getByRole('combobox').fill('open');
  await expect(dialog.getByRole('group', { name: 'Recent' })).toHaveCount(0);
});
