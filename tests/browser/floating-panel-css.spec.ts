import { expect, test, type Page } from '@playwright/test';

/** Verify authored defaults, native props, tokens, and nested unstyled choices. */
async function verifiesCssContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-floating-panel-css--contract');
  const styled = page.getByTestId('floating-css-content');
  const bareBody = page.getByTestId('floating-css-bare-body');
  const bareContent = page.getByTestId('floating-css-bare-content');

  await expect(styled).toBeVisible({ timeout: 30_000 });
  await expect(styled).toHaveClass(/leverui-floating-panel__content/);
  await expect(styled).toHaveClass(/consumer-content/);
  await expect(styled).toHaveAttribute('data-leverui-floating-panel-css', '');
  await expect(styled).toHaveCSS('display', 'flex');
  await expect(styled).toHaveCSS('min-height', '123px');
  await expect(bareBody).toHaveAttribute('data-unstyled', '');
  await expect(bareBody).not.toHaveAttribute('data-leverui-floating-panel-css');
  await expect(bareContent).toHaveAttribute('data-unstyled', '');
  await expect(bareContent).not.toHaveAttribute('data-leverui-floating-panel-css');

  await page.addStyleTag({
    content: '.consumer-content { --lui-colors-bg-panel: rgb(12, 34, 56); }',
  });
  await expect(styled).toHaveCSS('background-color', 'rgb(12, 34, 56)');
}

test('Floating Panel uses authored CSS and native customization', verifiesCssContract);
