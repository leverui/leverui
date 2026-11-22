import { expect, test } from '@playwright/test';

/** Verify nested input pages create actions from the typed value. */
test('Command input pages rename and invite from live query', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--input-page');
  const trigger = page.getByRole('button', { name: 'Search actions...' });
  await trigger.click();
  let dialog = page.getByRole('dialog', { name: 'Command palette' });
  await dialog.getByRole('option', { name: /Rename issue/ }).click();
  const renameInput = dialog.getByRole('combobox');
  await expect(renameInput).toHaveAttribute('placeholder', 'Type a new title...');
  await renameInput.fill('Updated issue title');
  await dialog.getByRole('option', { name: /Rename to "Updated issue title"/ }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('Updated issue title', { exact: true })).toBeVisible();

  await trigger.click();
  dialog = page.getByRole('dialog', { name: 'Command palette' });
  await dialog.getByRole('option', { name: /Invite by email/ }).click();
  const inviteInput = dialog.getByRole('combobox');
  await expect(inviteInput).toHaveAttribute('placeholder', 'name@company.com');
  await inviteInput.fill('friend@example.com');
  await dialog.getByRole('option', { name: /Send invite to friend@example.com/ }).click();
  await expect(page.getByText('Invited friend@example.com')).toBeVisible();
});
