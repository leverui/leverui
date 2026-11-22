import { expect, test } from '@playwright/test';

/** Verify the hosted Basic Command flow through a real primitive dialog. */
test('Command dialog searches, selects, closes, and resets', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--basic');
  const trigger = page.getByRole('button', { name: 'Search commands...' });
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  await expect(dialog).toHaveClass(/leverui-command-dialog__content/);
  await expect(dialog).toHaveCSS('overflow', 'hidden');
  const accessibleLabels = dialog.locator('.leverui-command-dialog__accessible-label');
  await expect(accessibleLabels).toHaveCount(2);
  await expect(accessibleLabels.first()).toHaveCSS('position', 'absolute');
  await expect(accessibleLabels.first()).toHaveCSS('clip', 'rect(0px, 0px, 0px, 0px)');
  await page.addStyleTag({
    content: '.leverui-command-dialog__content { overflow: visible; }',
  });
  await expect(dialog).toHaveCSS('overflow', 'visible');
  const input = dialog.getByRole('combobox', { name: 'Command palette' });
  await expect(input).toBeFocused();
  await expect(dialog.getByRole('option')).toHaveCount(7);

  await input.fill('save');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await expect(dialog.getByRole('option', { name: /Save/ }).locator('mark')).toHaveText('Save');
  await dialog.getByRole('option', { name: /Save/ }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('Ran Save')).toBeVisible();

  await trigger.click();
  await expect(page.getByRole('dialog').getByRole('combobox')).toHaveValue('');
  await expect(page.getByRole('dialog').getByRole('option')).toHaveCount(7);
  await page.getByRole('dialog').getByRole('combobox').press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
