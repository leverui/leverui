import { expect, test, type Page } from '@playwright/test';

/** Verify a consumer class and closest Theme scope across a custom portal. */
async function verifiesDialogThemeScope({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-dialog-css-theme--contract');
  const scope = page.getByTestId('dialog-theme-scope');
  const container = page.getByTestId('dialog-theme-container');
  await expect(scope).toHaveAttribute('data-leverui-color-mode', 'dark');

  await page.getByRole('button', { name: 'Open scoped dialog' }).click();
  const content = page.getByTestId('dialog-theme-content');
  await expect(container.getByTestId('dialog-theme-content')).toBeVisible();
  await expect(content).toHaveCSS('background-color', 'rgb(17, 17, 17)');
  await expect(content).toHaveCSS('border-top-width', '2px');
  await page.getByRole('button', { name: 'Close scoped dialog' }).click();

  await page.getByRole('button', { name: 'Toggle dialog appearance' }).click();
  await expect(scope).toHaveAttribute('data-leverui-color-mode', 'light');
  await page.getByRole('button', { name: 'Open scoped dialog' }).click();
  await expect(content).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(content).toHaveCSS('border-top-width', '2px');
}

test('Dialog inherits a reactive Theme through its portal destination', verifiesDialogThemeScope);
