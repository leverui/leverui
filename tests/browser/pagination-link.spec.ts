import { expect, test, type Page } from '@playwright/test';

/** Verify link mode renders real anchors with machine page URLs. */
async function verifiesPaginationLinks({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination-link--links');
  const root = page.getByTestId('pagination-link-root');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('pagination-link-prev')).toHaveAttribute(
    'href',
    '/articles?page=1',
  );
  await expect(page.getByTestId('pagination-link-next')).toHaveAttribute(
    'href',
    '/articles?page=3',
  );
  await expect(page.getByTestId('pagination-link-item').first()).toHaveAttribute(
    'href',
    '/articles?page=1',
  );
  await expect(root.locator('a[aria-current="page"]')).toHaveCount(1);
  await expect(root.locator('button')).toHaveCount(0);
  await expect(page.getByTestId('pagination-link-prev')).toHaveAttribute(
    'data-received-anchor-ref',
    'true',
  );
  await expect(page.getByTestId('pagination-link-ref-item')).toHaveAttribute(
    'data-received-anchor-ref',
    'true',
  );
  await expect(page.getByTestId('pagination-link-ref-item')).toHaveJSProperty('tagName', 'A');
}

test('Pagination link mode uses anchors and page URLs', verifiesPaginationLinks);
