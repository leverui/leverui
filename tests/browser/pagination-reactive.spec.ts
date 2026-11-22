import { expect, test, type Page } from '@playwright/test';

/** Verify callback changes update pages and gaps under one mounted machine. */
async function verifiesReactiveRenderers({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination-reactive--callbacks');
  const root = page.getByTestId('pagination-reactive-root');
  const toggle = page.getByTestId('pagination-reactive-toggle');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await root.evaluate(
    /** Mark the existing nav to prove callback changes do not replace it. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await expect(root.getByRole('button', { name: 'page 5', exact: true })).toBeVisible();
  await expect(root.locator('[data-pagination-ellipsis]')).toHaveCount(2);

  await toggle.click();
  await expect(page.getByTestId('pagination-reactive-page-5')).toHaveText('First 5');
  await expect(page.getByTestId('pagination-reactive-gap')).toHaveText(['First gap', 'First gap']);
  await toggle.click();
  await expect(page.getByTestId('pagination-reactive-page-5')).toHaveText('Second 5');
  await expect(page.getByTestId('pagination-reactive-gap')).toHaveText([
    'Second gap',
    'Second gap',
  ]);
  await toggle.click();
  await expect(page.getByTestId('pagination-reactive-page-5')).toHaveCount(0);
  await expect(root.getByRole('button', { name: 'page 5', exact: true })).toBeVisible();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(page.getByTestId('pagination-reactive-text')).toHaveText('5 of 10');
}

test('Pagination Items follows reactive page and ellipsis callbacks', verifiesReactiveRenderers);
