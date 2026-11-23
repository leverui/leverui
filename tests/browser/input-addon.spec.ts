import { expect, test, type Page } from '@playwright/test';

/** Verify a grouped addon preserves native editing and reactive sizing. */
async function verifiesInputAddonBrowser({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-input-addon--contract&viewMode=story');
  const addon = page.getByTestId('input-addon-prefix');
  const input = page.getByRole('textbox', { name: 'Website' });
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(addon).toHaveClass(/lui-input-addon/);
  await expect(addon).toHaveText('https://');
  await expect(addon).toHaveCSS('display', 'flex');
  await expect(addon).toHaveCSS('height', '36px');
  await input.fill('example.com');
  await expect(input).toHaveValue('example.com');
  await page.getByTestId('input-addon-toggle').click();
  await expect(addon).toHaveCSS('height', '44px');
  await expect(input).toHaveCSS('height', '44px');
  await expect(input).toHaveValue('example.com');
  await page.addStyleTag({ content: '.lui-input-addon { border-radius: 9px; }' });
  await expect(addon).toHaveCSS('border-top-left-radius', '9px');
}

test('Input Addon composes with Input and follows reactive variants', verifiesInputAddonBrowser);

/** Confirm unstyled removes authored styling while retaining native attributes. */
async function verifiesUnstyledAddon({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-input-addon--contract&viewMode=story');
  const styled = page.getByTestId('input-addon-styled');
  const plain = page.getByTestId('input-addon-unstyled');
  await expect(styled).toBeVisible({ timeout: 30_000 });
  await expect(styled).toHaveCSS('border-top-width', '1px');
  await expect(styled).toHaveCSS('padding-left', '12px');
  await expect(plain).toHaveAttribute('title', 'Plain prefix');
  await expect(plain).toHaveClass(/lui-input-addon/);
  await expect(plain).toHaveCSS('border-top-width', '0px');
  await expect(plain).toHaveCSS('padding-left', '0px');
  await expect(plain).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
}

test('unstyled Input Addon omits authored CSS and keeps native props', verifiesUnstyledAddon);

/** Follow authored size and variant media selectors without JavaScript resize work. */
async function verifiesResponsiveAddon({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 800 });
  await page.goto('/iframe.html?id=components-input-addon--contract&viewMode=story');
  const addon = page.getByTestId('input-addon-responsive');
  await expect(addon).toBeVisible({ timeout: 30_000 });
  await expect(addon).toHaveCSS('font-size', '14px');
  await expect(addon).toHaveCSS('padding-left', '10px');
  await expect(addon).toHaveCSS('border-left-color', /rgb\(/);
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(addon).toHaveCSS('font-size', '16px');
  await expect(addon).toHaveCSS('padding-left', '16px');
  await expect(addon).toHaveCSS('border-left-color', 'rgba(0, 0, 0, 0)');
}

test('Input Addon follows responsive authored CSS choices', verifiesResponsiveAddon);
