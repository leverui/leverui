import { expect, test, type Locator, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

/** Attempt the preview action by the browser's supported focus route. */
async function focusPreviewAction(page: Page, trigger: Locator): Promise<void> {
  await trigger.focus();
  await pressBrowserTab(page, true);
}

/** Keep preview controls out of the tab order until the content opens. */
async function verifiesPreviewFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--partial-height');
  const trigger = page.getByRole('button', { name: 'Toggle preview' });
  const action = page.getByTestId('collapsible-preview-action');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(action).toHaveAttribute('inert', '');
  await focusPreviewAction(page, trigger);
  await expect(action).not.toBeFocused();

  await trigger.click();
  await expect(action).not.toHaveAttribute('inert');
  await focusPreviewAction(page, trigger);
  await expect(action).toBeFocused();

  await trigger.click();
  await expect(action).toHaveAttribute('inert', '');
  await focusPreviewAction(page, trigger);
  await expect(action).not.toBeFocused();
}

test('Collapsible preview excludes hidden actions from keyboard navigation', verifiesPreviewFocus);

/** Preserve the primitive width preview and release its fixed size when opened. */
async function verifiesWidthPreview({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible-lifecycle--width-preview');
  const content = page.getByTestId('collapsible-width-content');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveAttribute('data-has-collapsed-size', '');
  await expect(content).toHaveCSS('min-width', '72px');
  await expect(content).toHaveCSS('max-width', '72px');
  await page.getByRole('button', { name: 'Toggle width preview' }).click();
  await expect(content).toHaveAttribute('data-state', 'open');
  await expect(content).not.toHaveCSS('max-width', '72px');
}

test('Collapsible preserves a width-based preview', verifiesWidthPreview);

/** Notify exactly once after each closing animation and subsequent unmount. */
async function verifiesExitCompletion({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible-lifecycle--exit-completion');
  const trigger = page.getByRole('button', { name: 'Toggle exiting content' });
  const content = page.getByTestId('collapsible-exit-content');
  const count = page.getByTestId('collapsible-exit-count');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveCount(0);
  await expect(count).toHaveText('0');

  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveCSS('animation-duration', '0.4s');
  await trigger.click();
  await expect(content).toHaveCount(1);
  await expect(count).toHaveText('0');
  await expect(content).toHaveCount(0);
  await expect(count).toHaveText('1');

  await trigger.click();
  await expect(content).toBeVisible();
  await trigger.click();
  await expect(content).toHaveCount(0);
  await expect(count).toHaveText('2');
}

test('Collapsible calls onExitComplete once after each content exit', verifiesExitCompletion);
