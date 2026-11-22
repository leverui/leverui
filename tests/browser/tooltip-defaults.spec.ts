import { expect, test, type Page } from '@playwright/test';

/** Verify inherited presence, reactive styling, and instance precedence. */
async function verifiesTooltipDefaults({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip-defaults--reactive');
  const closed = page.getByTestId('defaults-closed-content');
  const reactive = page.getByTestId('defaults-reactive-content');
  const explicit = page.getByTestId('defaults-explicit-content');
  await expect(page.getByTestId('defaults-toggle')).toBeVisible({ timeout: 30_000 });
  await expect(closed).toHaveCount(1);
  await expect(closed).toBeHidden();
  await expect(explicit).toHaveCount(0);
  await expect(reactive).toBeVisible();
  await expect(reactive).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  await page.getByTestId('defaults-toggle').click();
  await expect(reactive).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.getByTestId('defaults-explicit-trigger').hover();
  await expect(explicit).toBeVisible();
  await expect(explicit).toHaveCSS('background-color', 'rgb(12, 34, 56)');
}

test('Tooltip defaults update without replacing instance styling', verifiesTooltipDefaults);
