import { expect, test } from '@playwright/test';

/** Verify the visible marker loads and appends the next cursor page. */
test('Command load more appends a second page of people', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--load-more');
  await page.getByRole('button', { name: 'Browse people...' }).click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  // Twelve local people match "o": one eight-person page plus a four-person page.
  await dialog.getByRole('combobox').fill('o');
  await expect(dialog.getByRole('option').first()).toBeVisible();
  await dialog.getByRole('listbox').evaluate(
    /** Move the list marker into view if the first page fills the viewport. */
    (element) => {
      element.scrollTop = element.scrollHeight;
    },
  );
  await expect(dialog.getByRole('option')).toHaveCount(12);
  await expect(dialog.getByRole('option', { name: /Arjun Kapoor/ })).toHaveCount(1);
});
