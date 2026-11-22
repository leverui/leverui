import { expect, test, type Page } from '@playwright/test';

/** Check the automatic button and two explicit theme scopes. */
async function verifiesBasicTheme({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=foundations-theme--basic');
  await expect(page.getByRole('button', { name: 'Auto button' })).toBeVisible();
  const scopes = page.locator('#storybook-root [data-leverui-theme]');
  await expect(scopes).toHaveCount(2);
  await expect(scopes.nth(0)).toHaveAttribute('data-leverui-color-mode', 'dark');
  await expect(scopes.nth(1)).toHaveAttribute('data-leverui-color-mode', 'light');
  await expect(scopes.nth(0).getByRole('button', { name: 'Dark button' })).toBeVisible();
  await expect(scopes.nth(1).getByRole('button', { name: 'Light button' })).toBeVisible();
}

/** Preserve dark then light mode through nested scoped content. */
async function verifiesNestedTheme({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=foundations-theme--nested');
  const scopes = page.locator('#storybook-root [data-leverui-theme]');
  await expect(scopes).toHaveCount(2);
  await expect(scopes.nth(0)).toHaveAttribute('data-leverui-color-mode', 'dark');
  await expect(scopes.nth(1)).toHaveAttribute('data-leverui-color-mode', 'light');
  await expect(scopes.nth(1).getByText('Light theme')).toBeVisible();
  const nestedBoxes = page.locator('#storybook-root .theme-example-nested-box');
  await expect(nestedBoxes).toHaveCount(3);
  await expect(nestedBoxes.first()).toHaveCSS('padding', '32px');
  await expect(nestedBoxes.last()).toHaveCSS('border-top-width', '1px');
}

/** Require the portalled Popover content to own the explicit dark scope. */
async function verifiesPortalledTheme({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=foundations-theme--portalled');
  await page.getByRole('button', { name: 'Click me' }).first().click();
  const content = page.locator('[data-popover-content]');
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('data-leverui-theme', '');
  await expect(content).toHaveAttribute('data-leverui-color-mode', 'dark');
  await expect(content.getByText('Lanternwright notes')).toBeVisible();
  await expect(content.getByPlaceholder('Search')).toBeVisible();
  await expect(content.locator('.theme-example-popover-title')).toHaveCSS('font-weight', '500');
  await expect(content.locator('.theme-example-popover-body > *:nth-child(2)')).toHaveCSS(
    'margin-top',
    '16px',
  );
}

test('Theme Basic renders explicit modes', verifiesBasicTheme);
test('Theme Nested preserves closest scopes', verifiesNestedTheme);
test('Theme Portalled bridges mode into Popover', verifiesPortalledTheme);
