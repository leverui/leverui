import { expect, test, type Page } from '@playwright/test';

/** Keep the notification label available while clipping it from sight. */
async function verifiesHiddenLabel({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=utilities-visually-hidden--basic');
  await expect(page.getByRole('button', { name: '3 Notifications' })).toBeVisible();
  const label = page.locator('.lui-visually-hidden');
  await expect(label).toHaveText('Notifications');
  await expect(label).toHaveCSS('width', '1px');
  await expect(page.locator('#storybook-root .lucide-bell')).toHaveAttribute('aria-hidden', 'true');
}

/** Clip the caller's native input without adding a wrapper element. */
async function verifiesHiddenInput({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=utilities-visually-hidden--input');
  await expect(page.locator('#storybook-root')).toContainText('The input is hidden');
  const input = page.getByPlaceholder('Search...');
  await expect(input).toHaveClass(/lui-visually-hidden/);
  await expect(input).toHaveCSS('width', '1px');
  await input.focus();
  await expect(input).toBeFocused();
}

test('Visually Hidden keeps the notification label', verifiesHiddenLabel);
test('Visually Hidden applies to a child input', verifiesHiddenInput);
