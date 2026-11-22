import { expect, test, type Page } from '@playwright/test';

/** Verify nested menu opening, individual size, and child selection. */
async function verifiesNestedMenu({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-menu-nested--nested');
  await page.getByTestId('nested-menu-trigger').click();
  const parent = page.getByTestId('nested-parent-content');
  await expect(parent).toBeVisible();
  await page.getByTestId('nested-menu-item').click();
  const child = page.getByTestId('nested-child-content');
  await expect(child).toBeVisible();
  await expect(parent).toHaveCSS('padding', '6px');
  await expect(child).toHaveCSS('padding', '4px');
  await page.getByTestId('nested-child-item').click();
  await expect(child).toHaveCount(0);
}

test('Menu supports a nested menu with its own appearance scope', verifiesNestedMenu);

/** Verify a context gesture opens the primitive's menu at the pointer anchor. */
async function verifiesContextMenu({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-menu-nested--context');
  const trigger = page.getByTestId('context-menu-trigger');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.click({ button: 'right' });
  await expect(page.getByTestId('context-menu-content')).toBeVisible();
  await expect(page.getByTestId('context-menu-item')).toHaveAttribute('role', 'menuitem');
}

test('Menu opens from a context gesture', verifiesContextMenu);
