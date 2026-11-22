import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'with-error-level',
  'with-export',
  'with-export-logo',
  'with-fill',
  'with-input',
  'with-overlay',
  'with-sizes',
  'with-spinner',
  'with-store',
] as const;

/** Require every QR story to encode at least one pattern. */
async function verifiesEveryQrCodeExample({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-qrcode--${id}`);
    await expect(
      page.locator('#storybook-root [data-qr-code-pattern]').first(),
      `QR story ${id} should encode a pattern`,
    ).toBeAttached();
  }
}

/** Check seven sizes and both colors. */
async function verifiesQrDisplayVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-qrcode--with-sizes');
  await expect(page.locator('#storybook-root [data-qr-code-root]')).toHaveCount(7);
  await page.goto('/iframe.html?id=components-qrcode--with-fill');
  await expect(page.locator('#storybook-root [data-qr-code-frame]')).toHaveCount(2);
}

/** Require typed input to change the generated QR path. */
async function verifiesQrInput({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-qrcode--with-input');
  const pattern = page.locator('#storybook-root [data-qr-code-pattern]');
  const initial = await pattern.getAttribute('d');
  await page.locator('#storybook-root input').fill('https://example.com');
  await expect(pattern).not.toHaveAttribute('d', initial ?? '');
}

/** Require the external machine button to regenerate the pattern. */
async function verifiesQrStore({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-qrcode--with-store');
  const pattern = page.locator('#storybook-root [data-qr-code-pattern]');
  const initial = await pattern.getAttribute('d');
  await page.getByRole('button', { name: 'Update to x.com' }).click();
  await expect(pattern).not.toHaveAttribute('d', initial ?? '');
}

/** Check correction choices and exported PNG filenames. */
async function verifiesQrControls({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-qrcode--with-error-level');
  const pattern = page.locator('#storybook-root [data-qr-code-pattern]');
  const initial = await pattern.getAttribute('d');
  await page.getByText('H', { exact: true }).click();
  await expect(pattern).not.toHaveAttribute('d', initial ?? '');
  await page.goto('/iframe.html?id=components-qrcode--with-export');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  expect((await download).suggestedFilename()).toBe('qr-code.png');
  await page.goto('/iframe.html?id=components-qrcode--with-export-logo');
  const logoDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  expect((await logoDownload).suggestedFilename()).toBe('qr-code-with-logo.png');
}

test('all QrCode examples render', verifiesEveryQrCodeExample);
test('QrCode sizes and fills match the counts', verifiesQrDisplayVariants);
test('QrCode input regenerates the pattern', verifiesQrInput);
test('QrCode store regenerates the pattern', verifiesQrStore);
test('QrCode correction and download controls work', verifiesQrControls);
