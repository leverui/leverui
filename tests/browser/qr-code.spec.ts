import { expect, test, type Page } from '@playwright/test';

/** Check QR geometry, inherited variants, and controlled value updates. */
async function verifiesQrCodeContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-qr-code--contract');
  const root = page.getByTestId('qr-root');
  const frame = page.getByTestId('qr-frame');
  const path = frame.locator('path');
  const initialPath = await path.getAttribute('d');

  await expect(root).toHaveAttribute('data-qr-code-root');
  await expect(frame).toHaveAttribute('data-qr-code-frame');
  await expect(frame).toHaveCSS('width', '80px');
  await expect(frame).toHaveCSS('height', '80px');
  await expect(path).toHaveAttribute('d', /.+/);
  await expect(path).toHaveClass(/leverui-qr-code__pattern/);
  const overlay = page.getByTestId('qr-overlay');
  await expect(overlay).toHaveCSS('display', 'flex');
  const overlayWidth = await overlay.evaluate(
    /** Read the browser's subpixel QR overlay measurement. */
    (element) => Number.parseFloat(getComputedStyle(element).width),
  );
  expect(overlayWidth).toBeCloseTo(80 / 3, 1);
  await expect(page.getByTestId('qr-value')).toHaveText('https://leverui.com');
  await expect(page.getByTestId('qr-download')).toHaveJSProperty('tagName', 'BUTTON');
  await expect(root).not.toHaveAttribute('size');

  await page.getByTestId('qr-value-toggle').click();
  await expect(page.getByTestId('qr-value')).toHaveText('https://leverui.com/updated');
  expect(await path.getAttribute('d')).not.toBe(initialPath);
  await page.getByTestId('qr-size-toggle').click();
  await expect(frame).toHaveCSS('width', '160px');
  await expect(root).toHaveAttribute('data-qr-code-root');
}

test('QR Code preserves machine output and recipe sizing', verifiesQrCodeContract);

/** Check a consumer owned QR machine updates its SVG path. */
async function verifiesExternalQrCode({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-qr-code--contract');
  const root = page.getByTestId('qr-external-root');
  const frame = page.getByTestId('qr-external-frame');
  const path = page.getByTestId('qr-external-pattern');
  const initialPath = await path.getAttribute('d');
  await expect(root).toHaveAttribute('data-qr-code-root');
  await expect(frame).toHaveCSS('width', '64px');
  await expect(page.getByTestId('qr-external-value')).toHaveText('External QR');
  await page.getByTestId('qr-external-toggle').click();
  await expect(page.getByTestId('qr-external-value')).toHaveText('Updated external QR');
  expect(await path.getAttribute('d')).not.toBe(initialPath);
}

test('QR Code accepts an external Solid machine', verifiesExternalQrCode);

/** Verify the primitive exports the current QR image under the requested file name. */
async function verifiesQrCodeDownload({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-qr-code--contract');
  const download = page.waitForEvent('download');
  await page.getByTestId('qr-download').click();
  expect((await download).suggestedFilename()).toBe('leverui-qr.png');
}

test('QR Code downloads an encoded PNG', verifiesQrCodeDownload);
