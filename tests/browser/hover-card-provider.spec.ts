import { expect, test, type Page } from '@playwright/test';

/** Verify caller-owned state, native composition, multiple triggers, and defaults. */
async function verifiesHoverCardProvider({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-hover-card-provider--contract');
  const first = page.getByTestId('hover-first');
  const second = page.getByTestId('hover-second');
  const content = page.getByTestId('hover-provider-content');
  await expect(first).toBeVisible({ timeout: 30_000 });
  await expect(first).toHaveJSProperty('tagName', 'A');
  await expect(second).toHaveJSProperty('tagName', 'A');
  await expect(content).toHaveCount(0);
  await page.getByTestId('hover-toggle').click();
  await expect(content).toBeVisible();
  await expect(content).toHaveCSS('padding', '24px');
  await expect(page.getByTestId('hover-controlled-open')).toHaveText('true');
  await page.getByTestId('hover-toggle').click();
  await expect(content).toHaveCount(0);
  await first.hover();
  await expect(content).toBeVisible();
  await expect(page.getByTestId('hover-trigger-value')).toHaveText('first');
  await second.hover();
  await expect(page.getByTestId('hover-trigger-value')).toHaveText('second');
  await page.getByTestId('hover-disable').hover();
  await expect(content).toHaveCount(0);
  await page.getByTestId('hover-disable').click();
  await expect(page.getByTestId('hover-disabled-state')).toHaveText('true');
  await first.hover();
  await expect(content).toHaveCount(0);
}

test('Hover Card supports caller-owned state and provider defaults', verifiesHoverCardProvider);
