import { expect, test, type Page } from '@playwright/test';

/** Verify a custom portal stays inside its host and restores explicit focus. */
async function verifiesContainedPortal({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer-options--contract');
  const container = page.getByTestId('drawer-custom-container');
  const trigger = page.getByTestId('drawer-custom-trigger');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(container.getByTestId('drawer-generic-portal')).toBeVisible();
  await trigger.click();
  const content = container.getByTestId('drawer-custom-content');
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(container.getByTestId('drawer-custom-positioner')).toHaveCSS('position', 'absolute');
  await expect(page.getByRole('textbox', { name: 'Contained Drawer field' })).toBeFocused();
  await content.getByRole('button', { name: 'Close contained Drawer' }).click();
  await expect(content).toHaveCount(0);
  await expect(page.getByTestId('drawer-final-focus')).toBeFocused();
}

test('Drawer supports a custom portal and explicit focus targets', verifiesContainedPortal);

/** Verify nonmodal Drawer content allows page controls to remain interactive. */
async function verifiesNonmodalDrawer({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer-options--contract');
  await page.getByTestId('drawer-nonmodal-trigger').click();
  const content = page.getByTestId('drawer-nonmodal-content');
  const outside = page.getByTestId('drawer-outside-action');
  await expect(content).toBeVisible();
  await expect(content).not.toHaveAttribute('aria-modal', 'true');
  await outside.click();
  await expect(page.getByTestId('drawer-outside-count')).toHaveText('1');
  await expect(content).toBeVisible();
  await outside.focus();
  await expect(outside).toBeFocused();
  await content.getByRole('button', { name: 'Close nonmodal Drawer' }).click();
  await expect(content).toHaveCount(0);
}

test('Drawer nonmodal mode leaves page controls usable', verifiesNonmodalDrawer);
