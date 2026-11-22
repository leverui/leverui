import { expect, test, type Page } from '@playwright/test';

/** Verify controlled page state and reactive provider defaults. */
async function verifiesControlledPagination({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination-state--controlled');
  const root = page.getByTestId('pagination-controlled');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await root.evaluate(
    /** Mark the original native nav before its state changes. */
    (element) => element.setAttribute('data-original', 'true'),
  );
  await expect(page.getByTestId('pagination-state')).toHaveText('2');
  await page.getByTestId('pagination-controlled-next').click();
  await expect(page.getByTestId('pagination-state')).toHaveText('3');
  await page.getByTestId('pagination-shrink').click();
  await expect(root).toHaveAttribute('data-original', 'true');
  await expect(page.getByTestId('pagination-controlled-text')).toHaveText('3 of 3');
  await expect(page.getByTestId('pagination-controlled-next')).toBeDisabled();
}

test('Pagination controlled state and defaults remain reactive', verifiesControlledPagination);

/** Verify a caller-owned machine updates the same root. */
async function verifiesStorePagination({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination-state--store');
  const root = page.getByTestId('pagination-store');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('pagination-state')).toHaveText('2');
  await root.evaluate(
    /** Preserve a marker on the current nav element. */
    (element) => element.setAttribute('data-original', 'true'),
  );
  await page.getByTestId('pagination-store-next').click();
  await expect(root).toHaveAttribute('data-original', 'true');
  await expect(page.getByTestId('pagination-state')).toHaveText('3');
}

test('Pagination RootProvider follows an external machine', verifiesStorePagination);
