import { expect, test, type Page } from '@playwright/test';

/** Verify Drawer state, focus, semantic parts, nested use, and dismissal. */
async function verifiesDrawerContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer--contract');
  const trigger = page.getByTestId('drawer-trigger');
  const content = page.getByTestId('drawer-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveCount(0);
  await expect(trigger).not.toHaveAttribute('aria-controls');
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(content).toHaveAttribute('data-drawer-ref-tag', 'div');
  await expect(content).toHaveJSProperty('tagName', 'DIV');
  await expect(content).toHaveClass(/leverui-drawer__content/);
  await expect(page.getByTestId('drawer-open-state')).toHaveText('true');
  await expect(page.getByRole('textbox', { name: 'Drawer first field' })).toBeFocused();
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Drawer content has no machine ID.');
  await expect(trigger).toHaveAttribute('aria-controls', contentId);
  await expect(content).toHaveAttribute('aria-labelledby', /.+/);
  await expect(content).toHaveAttribute('aria-describedby', /.+/);
  const descriptionId = await content.getAttribute('aria-describedby');
  if (!descriptionId) throw new Error('Drawer description has no machine ID.');
  await expect(page.locator(`[id="${descriptionId}"]`)).toHaveJSProperty('tagName', 'DIV');
  await expect(page.getByTestId('drawer-backdrop')).toBeVisible();
  await expect(page.getByTestId('drawer-positioner')).toHaveCSS('justify-content', 'flex-end');
  await expect(content).toHaveCSS('max-width', '448px');
  await page.getByRole('button', { name: 'Expand Drawer' }).click();
  await expect(content).toHaveCSS('max-width', '672px');
  await expect(content).toHaveAttribute('id', contentId);
  await expect(page.getByTestId('drawer-action')).not.toHaveAttribute('id');
  await page.getByTestId('nested-drawer-trigger').click();
  const nested = page.getByTestId('nested-drawer-content');
  await expect(nested).toBeVisible();
  await expect(nested).toHaveClass(/leverui-drawer__content/);
  await expect(nested.getByRole('button', { name: 'Close nested Drawer' })).toBeVisible();
  await nested.getByRole('button', { name: 'Close nested Drawer' }).click();
  await expect(nested).toHaveCount(0);
  await expect(page.getByTestId('nested-drawer-trigger')).toBeFocused();
  await page.getByTestId('nested-drawer-trigger').click();
  await expect(nested.getByRole('button', { name: 'Close nested Drawer' })).toBeVisible();
  await expect(nested).toHaveAttribute('data-nested', 'dialog');
  await page.keyboard.press('Escape');
  await expect(nested).toHaveCount(0);
  await expect(page.getByTestId('nested-drawer-trigger')).toBeFocused();
  await page.getByTestId('drawer-action').click();
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.getByTestId('drawer-action-open-state')).toHaveText('true');
  await expect(page.getByTestId('drawer-open-state')).toHaveText('false');
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Drawer first field' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
}

test('Drawer composes the primitive Dialog behavior with authored parts', verifiesDrawerContract);

/** Check a fresh Drawer's Escape dismissal and focus return. */
async function verifiesDrawerEscape({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer--contract');
  const trigger = page.getByTestId('drawer-trigger');
  const content = page.getByTestId('drawer-content');
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Drawer first field' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
}

test('Drawer closes on Escape and restores focus', verifiesDrawerEscape);

/** Confirm an action-close does not leave the next open behind a stale layer. */
async function verifiesActionReopenEscape({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer--contract');
  const trigger = page.getByTestId('drawer-trigger');
  const content = page.getByTestId('drawer-content');
  await trigger.click();
  await page.getByTestId('drawer-action').click();
  await expect(content).toHaveCount(0);
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Drawer first field' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
}

test('Drawer action-close preserves later Escape dismissal', verifiesActionReopenEscape);

/** Verify the external Drawer accessor, context, and reactive provider defaults. */
async function verifiesDrawerProvider({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer-provider--contract');
  const content = page.getByTestId('drawer-provider-content');
  await expect(page.getByTestId('drawer-provider-trigger')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('drawer-provider-state')).toHaveText('false');
  await page.getByTestId('drawer-external-open').click();
  await expect(content).toBeVisible();
  await expect(page.getByTestId('drawer-provider-state')).toHaveText('true');
  await expect(page.getByTestId('drawer-provider-positioner')).toHaveCSS(
    'justify-content',
    'flex-start',
  );
  await expect(content).toHaveCSS('max-width', '320px');
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('External Drawer content has no ID.');
  await content.getByRole('button', { name: 'Expand provider Drawer' }).click();
  await expect(content).toHaveCSS('max-width', '672px');
  await expect(content).toHaveAttribute('id', contentId);
  await page.getByTestId('drawer-provider-action').click();
  await expect(content).toHaveCount(0);
  await expect(page.getByTestId('drawer-provider-state')).toHaveText('false');
  await expect(page.getByTestId('drawer-provider-bound-action')).toHaveText('saved:click:true');
}

test(
  'Drawer provider keeps caller-owned state and live appearance defaults',
  verifiesDrawerProvider,
);
