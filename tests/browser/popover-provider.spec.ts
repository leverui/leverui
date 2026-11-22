import { expect, test, type Page } from '@playwright/test';

/** Verify external state, multiple triggers, and reactive recipe defaults. */
async function verifiesPopoverProvider({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover-provider--contract');
  const first = page.getByTestId('popover-first-trigger');
  const second = page.getByTestId('popover-second-trigger');
  const content = page.getByTestId('popover-provider-content');
  const body = page.getByTestId('popover-provider-body');
  await expect(first).toBeVisible({ timeout: 30_000 });
  await expect(second).toHaveJSProperty('tagName', 'BUTTON');
  await expect(content).toBeHidden();
  await expect(page.getByTestId('popover-fixed-content')).toBeHidden();

  await page.getByTestId('popover-provider-open').click();
  await expect(page.getByTestId('popover-controlled-open')).toHaveText('true');
  await expect(page.getByTestId('popover-machine-open')).toHaveText('true');
  await expect(content).toBeVisible();
  await expect(page.getByTestId('popover-enter-count')).toHaveText('1');
  await expect(body).toHaveCSS('padding', '24px');
  await page.getByTestId('popover-size-toggle').click();
  await expect(body).toHaveCSS('padding', '16px');

  await page.getByTestId('popover-provider-close').click();
  await expect(page.getByTestId('popover-controlled-open')).toHaveText('false');
  await expect(page.getByTestId('popover-machine-open')).toHaveText('false');
  await expect(content).toBeHidden();
  await second.click();
  await expect(content).toBeVisible();
  await expect(page.getByTestId('popover-trigger-value')).toHaveText('second');
  await first.click();
  await expect(page.getByTestId('popover-trigger-value')).toHaveText('first');
  await page.getByTestId('popover-provider-close').click();
  await expect(content).toBeHidden();
  await page.getByTestId('popover-fixed-trigger').click();
  await expect(page.getByTestId('popover-fixed-content')).toBeVisible();
  await expect(page.getByTestId('popover-fixed-body')).toHaveCSS('padding', '12px');
}

test('Popover supports external state and reactive provider defaults', verifiesPopoverProvider);
