import { expect, test } from '@playwright/test';

/** Verify the large Command catalog mounts a bounded window and filters. */
test('virtualized Command searches 5,000 actions without mounting all options', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=components-command--virtualized');
  await page.getByRole('button', { name: 'Search documents...' }).click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox');
  await expect(dialog.getByText('5,000 results')).toBeVisible();
  const mounted = await dialog.getByRole('option').count();
  expect(mounted).toBeGreaterThan(0);
  expect(mounted).toBeLessThan(100);

  await input.fill('document-831');
  await expect(dialog.getByText('6 results')).toBeVisible();
  await expect(dialog.getByRole('option')).toHaveCount(6);
  await expect(dialog.getByRole('option', { name: /Open document-831/ })).toBeVisible();
});
