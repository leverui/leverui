import { expect, test, type Page } from '@playwright/test';

/** Verify caller-owned state, content grouping, and selected native tags. */
async function verifiesTabsFamily({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tabs-family--contract');
  const root = page.getByTestId('tabs-family-root');
  const first = page.getByTestId('tabs-family-first');
  const second = page.getByTestId('tabs-family-second');
  const group = page.getByTestId('tabs-family-group');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveClass(/lui-tabs__root/);
  await expect(first).toHaveAttribute('href', '#first');
  await expect(first).toHaveAttribute('role', 'tab');
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await expect(group).toHaveClass(/lui-tabs__contentGroup/);
  await expect(page.getByTestId('tabs-family-panel-first')).toBeVisible();
  await expect(root).toHaveAttribute('data-size', 'sm');
  await expect(root).toHaveAttribute('data-variant', 'enclosed');
  await second.click();
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('tabs-family-value')).toHaveText('second');
  await expect(page.getByTestId('tabs-family-panel-second')).toBeVisible();
  await expect(second).toHaveCSS('height', '36px');
  await page.getByTestId('tabs-family-size').click();
  await expect(root).toHaveAttribute('data-size', 'lg');
  await expect(second).toHaveCSS('height', '44px');
  await expect(page.getByTestId('tabs-family-value')).toHaveText('second');
}

test('Tabs exposes caller-owned state and its complete part family', verifiesTabsFamily);
