import { expect, test, type Page } from '@playwright/test';

/** Verify caller-owned elements retain the primitive behavior and CSS customization. */
async function verifiesNativePagination({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination-native--unstyled');
  const root = page.getByTestId('pagination-native-root');
  const text = page.getByTestId('pagination-native-text');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-pagination-root');
  await expect(root).toHaveAttribute('data-received-root-ref', 'true');
  await expect(root).toHaveAttribute('data-unstyled', '');
  await expect(root).toHaveClass(/leverui-pagination__root/);
  await expect(text).toHaveAttribute('data-received-text-ref', 'true');
  await expect(text).toHaveAttribute('data-unstyled', '');
  await expect(text).toHaveClass(/leverui-pagination__page-text/);
  await expect(text).toHaveCSS('font-weight', '400');
  await page.addStyleTag({
    content: '.leverui-pagination__page-text { font-weight: 600; }',
  });
  await expect(text).toHaveCSS('font-weight', '600');
  await root.getByRole('button', { name: 'page 2' }).click();
  await expect(text).toHaveText('2 of 10');
}

test('Pagination native child and unstyled CSS paths remain interactive', verifiesNativePagination);
