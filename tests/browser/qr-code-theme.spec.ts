import { expect, test, type Page } from '@playwright/test';

const sizes = [
  ['2xs', '40px'],
  ['xs', '64px'],
  ['sm', '80px'],
  ['md', '120px'],
  ['lg', '160px'],
  ['xl', '200px'],
  ['2xl', '240px'],
] as const;

/** Verify QR size variants, responsive CSS, and consumer extension. */
async function verifiesQrTheme({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-qr-code-theme--contract');
  for (const [size, width] of sizes) {
    await expect(page.getByTestId(`qr-frame-${size}`)).toHaveCSS('width', width);
  }
  await expect(page.getByTestId('qr-size-full')).toHaveCSS('--lui-qr-code-size', '100%');
  await page.setViewportSize({ width: 600, height: 800 });
  await expect(page.getByTestId('qr-responsive-frame')).toHaveCSS('width', '40px');
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(page.getByTestId('qr-responsive-frame')).toHaveCSS('width', '200px');
  await expect(page.getByTestId('qr-custom-frame')).toHaveCSS('width', '173px');
  expect(
    await page.getByTestId('qr-unstyled-frame').evaluate(
      /** Confirm the unstyled root contributes no default size variable. */
      (element) => getComputedStyle(element).getPropertyValue('--lui-qr-code-size'),
    ),
  ).toBe('');
  await expect(page.getByTestId('qr-outer-root')).toHaveCSS('--lui-qr-code-size', '80px');
  await expect(page.getByTestId('qr-inner-root')).toHaveCSS('--lui-qr-code-size', '240px');
  await page.addStyleTag({
    content: '[data-testid="qr-override-frame"] { --lui-qr-code-size: 111px; }',
  });
  await expect(page.getByTestId('qr-override-frame')).toHaveCSS('width', '111px');
}

/** Verify the overlay follows the closest explicit color scope. */
async function verifiesQrScopes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-qr-code-theme--contract');
  const dark = page.getByTestId('qr-dark-overlay');
  const light = page.getByTestId('qr-light-overlay');
  const darkBg = await dark.evaluate(
    /** Read the dark overlay's closest semantic background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  const lightBg = await light.evaluate(
    /** Read the nested light overlay's semantic background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(darkBg).not.toBe(lightBg);
  await page.evaluate(
    /** Change the document mode without replacing either nested Theme. */
    () => document.documentElement.setAttribute('data-lui-color-mode', 'dark'),
  );
  await expect(dark).toHaveCSS('background-color', darkBg);
  await expect(light).toHaveCSS('background-color', lightBg);
}

test('QR CSS sizes and overrides resolve in Chromium', verifiesQrTheme);
test('QR overlay follows nested Theme scopes', verifiesQrScopes);

/** Confirm consumer styles win and unstyled parts retain machine hooks. */
async function verifiesQrConsumerCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-qr-code-theme--contract');
  await page.addStyleTag({
    content: `
      [data-testid='qr-custom-frame'] { fill: rgb(12, 34, 56); }
      [data-testid='qr-dark-overlay'] { background: rgb(45, 67, 89); }
    `,
  });
  await expect(page.getByTestId('qr-custom-frame')).toHaveCSS('fill', 'rgb(12, 34, 56)');
  await expect(page.getByTestId('qr-dark-overlay')).toHaveCSS(
    'background-color',
    'rgb(45, 67, 89)',
  );
  await expect(page.getByTestId('qr-unstyled-root')).toHaveAttribute('data-unstyled', '');
  await expect(page.getByTestId('qr-unstyled-frame')).toHaveAttribute('data-unstyled', '');
  await expect(page.getByTestId('qr-unstyled-frame').locator('path')).toHaveAttribute('d', /.+/);
}

test('QR Code accepts consumer CSS and unstyled composition', verifiesQrConsumerCss);
