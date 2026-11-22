import { expect, test } from '@playwright/test';

/** Verify the public Command story exposes the supplied resource destinations. */
test('Command Links lists six navigable Lever UI resources', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--links');
  await page.getByRole('button', { name: 'Search documentation...' }).click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const options = dialog.getByRole('option');
  await expect(options).toHaveCount(6);

  const destinations = [
    ['Getting started', 'https://leverui.com/docs/getting-started'],
    ['Components', 'https://leverui.com/docs/components'],
    ['Theming', 'https://leverui.com/docs/theming'],
    ['Charts', 'https://leverui.com/docs/charts'],
    ['Templates', 'https://leverui.com/templates'],
    ['Source repository', 'https://github.com/leverui/leverui'],
  ] as const;
  for (const [label, href] of destinations) {
    const option = dialog.getByRole('option', { name: label });
    await expect(option).toHaveAttribute('href', href);
    await expect(option).toHaveAttribute('target', '_blank');
  }
});
