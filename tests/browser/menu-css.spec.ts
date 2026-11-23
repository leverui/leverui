import { expect, test, type Page } from '@playwright/test';

/** Verify responsive choices, native overrides, and part-level opt-out. */
async function verifiesMenuCss({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto('/iframe.html?id=internal-menu-css--contract');
  const content = page.getByTestId('menu-css-content');
  const item = page.getByTestId('menu-css-item');
  const bareItem = page.getByTestId('menu-css-bare-item');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveClass(/lui-menu__content/);
  await expect(content).toHaveClass(/consumer-menu/);
  await expect(content).toHaveAttribute('data-lui-menu-css', '');
  await expect(content).toHaveCSS('min-height', '123px');
  await expect(item).toHaveCSS('font-size', '12px');
  await expect(bareItem).toHaveAttribute('data-unstyled', '');
  await expect(bareItem).not.toHaveAttribute('data-lui-menu-css');

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(item).toHaveCSS('font-size', '14px');
  await expect(item).toHaveAttribute('data-variant-md', 'solid');
  await page.addStyleTag({
    content: '.consumer-menu { --lui-menu-background: rgb(12, 34, 56); }',
  });
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
}

/** Verify root unstyled preserves the primitive menu structure without authored defaults. */
async function verifiesBareMenu({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-menu-css--bare');
  const content = page.getByTestId('menu-css-bare-content');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveAttribute('role', 'menu');
  await expect(content).toHaveClass(/lui-menu__content/);
  await expect(content).toHaveAttribute('data-unstyled', '');
  await expect(content).not.toHaveAttribute('data-lui-menu-css');
}

test('Menu uses authored responsive CSS and native customization', verifiesMenuCss);
test('Menu root unstyled keeps its primitive surface', verifiesBareMenu);
