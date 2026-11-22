import { expect, test, type Page } from '@playwright/test';

/** Verify an async branch can load, mutate, and filter nested descendants. */
async function verifiesDynamicBranches({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tree-view-dynamic--contract');
  const folder = page.getByTestId('dynamic-tree-folder');
  const loaded = page.getByTestId('dynamic-tree-loaded');
  await expect(folder).toBeVisible({ timeout: 30_000 });
  await expect(loaded).toHaveCount(0);
  await folder.click();
  await expect(folder).toHaveAttribute('data-state', 'open');
  await expect(loaded).toBeVisible();
  await expect(loaded).toHaveAttribute('role', 'row');
  await page.getByTestId('dynamic-tree-add').click();
  await expect(page.getByTestId('dynamic-tree-added')).toBeVisible();
  await page.getByTestId('dynamic-tree-filter').click();
  await expect(loaded).toBeVisible();
  await expect(page.getByTestId('dynamic-tree-added')).toHaveCount(0);
  await expect(page.getByTestId('dynamic-tree-readme')).toHaveCount(0);
}

test('Tree View updates an asynchronous nested collection', verifiesDynamicBranches);
