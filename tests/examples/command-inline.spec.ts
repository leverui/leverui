import { expect, test } from '@playwright/test';

/** Verify the first hosted Command port through its accessible browser behavior. */
test('inline Command groups, searches, and highlights results', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--inline');

  const input = page.getByRole('combobox', { name: 'Search commands' });
  await expect(input).toBeVisible();
  await expect(input).not.toHaveAttribute('id', /undefined/);
  await expect(page.getByRole('group')).toHaveCount(2);
  await expect(page.getByRole('option')).toHaveCount(6);

  await input.fill('prof');
  await expect(page.getByRole('group', { name: 'Settings' })).toBeVisible();
  await expect(page.getByRole('option')).toHaveCount(1);
  await expect(page.getByRole('option', { name: /Profile/ }).locator('mark')).toHaveText('Prof');

  await input.fill('not-a-command');
  await expect(page.getByText('No results found')).toBeVisible();
  await expect(page.getByRole('option')).toHaveCount(0);
});
