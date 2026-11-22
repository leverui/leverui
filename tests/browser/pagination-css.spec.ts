import { expect, test, type Page } from '@playwright/test';

/** Read the final root color after a consumer stylesheet overrides its token. */
async function verifiesCssOverride({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination-css--override');
  const root = page.getByTestId('pagination-css-root');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveCSS('color', 'rgb(13, 97, 142)');
  await expect(root).toHaveClass(/pagination-css/);
  await expect(root.locator('[data-pagination-item]')).toHaveCount(3);
}

test('Pagination accepts an ordinary CSS token override', verifiesCssOverride);
