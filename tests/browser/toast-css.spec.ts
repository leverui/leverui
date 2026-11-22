import { expect, test, type Page } from '@playwright/test';

/** Verify consumer CSS, unstyled semantics, and no Toast style insertion. */
async function verifiesToastCssContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-toast-css--contract');
  const region = page.getByTestId('toast-css-region');
  await expect(region).toHaveAttribute('role', 'region', { timeout: 30_000 });
  await expect(region).toHaveClass(/leverui-toast__toaster/);
  await page.addStyleTag({
    content: `[data-testid='toast-css-styled'] {
      --leverui-colors-green-solid: rgb(11 22 33);
    }
    [data-testid='toast-css-styled'] .leverui-toast__title {
      font-size: 18px;
    }`,
  });
  await page.getByTestId('toast-css-show-styled').click();
  const styled = page.getByTestId('toast-css-styled');
  await expect(styled).toHaveAttribute('data-type', 'success');
  await expect(styled).toHaveClass(/leverui-toast__root/);
  await expect(styled).toHaveCSS('background-color', 'rgb(11, 22, 33)');
  await expect(styled.locator('.leverui-toast__title')).toHaveCSS('font-size', '18px');
  await page.getByTestId('toast-css-show-unstyled').click();
  const unstyled = page.getByTestId('toast-css-unstyled');
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled.locator('.leverui-toast__title')).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).not.toHaveCSS('display', 'flex');
  await expect(unstyled).toContainText('Unstyled toast');
}

test(
  'Toast uses authored CSS with consumer overrides and unstyled parts',
  verifiesToastCssContract,
);
