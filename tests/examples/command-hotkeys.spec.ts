import { expect, test } from '@playwright/test';

/** Verify scoped Command actions and shortcuts through their browser behavior. */
test('Command shares actions between its menu and scoped hotkeys', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--hotkeys');
  const trigger = page.getByRole('button', { name: /Search actions/ });
  await expect(trigger).toBeVisible();
  await page.keyboard.press('c');
  await expect(page.getByText('Ran Create issue (shortcut)')).toBeVisible();
  await trigger.click();
  let dialog = page.getByRole('dialog', { name: 'Command palette' });
  await expect(dialog.getByRole('option')).toHaveCount(5);
  await expect(dialog.getByRole('group', { name: 'Inbox' }).getByRole('option')).toHaveCount(2);
  await dialog.getByRole('option', { name: /Archive notification/ }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('Ran Archive notification (menu)')).toBeVisible();

  await page.getByText('Issue view').click();
  await trigger.click();
  dialog = page.getByRole('dialog', { name: 'Command palette' });
  await expect(dialog.getByRole('option')).toHaveCount(6);
  await expect(dialog.getByRole('group', { name: 'Issue' }).getByRole('option')).toHaveCount(3);
  await dialog.getByRole('combobox').fill('status');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await dialog.getByRole('option', { name: /Change status/ }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('Ran Change status (menu)')).toBeVisible();

  await page.keyboard.press('c');
  await expect(page.getByText('Ran Create issue (shortcut)')).toBeVisible();
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible();
});

/** Verify sequence shortcuts and view-only actions with the menu closed. */
test('Command applies scoped and sequential shortcuts', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--hotkeys');
  await expect(page.getByRole('button', { name: /Search actions/ })).toBeVisible();
  await page.keyboard.press('g');
  await page.keyboard.press('i');
  await expect(page.getByText('Ran Go to inbox (shortcut)')).toBeVisible();
  await page.keyboard.press('e');
  await expect(page.getByText('Ran Archive notification (shortcut)')).toBeVisible();

  await page.getByText('Issue view').click();
  await page.getByText('Ran Archive notification (shortcut)').click();
  await page.keyboard.press('i');
  await expect(page.getByText('Ran Assign to me (shortcut)')).toBeVisible();
  await page.keyboard.press('e');
  await expect(page.getByText('Ran Assign to me (shortcut)')).toBeVisible();
});
