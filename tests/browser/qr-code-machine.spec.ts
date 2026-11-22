import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/** Verify uncontrolled updates, callback details, and encoding options. */
async function verifiesQrMachine({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-qr-code-machine--contract');
  // Zag 2 writes no `id` on the root, even from `ids`; find it by its scoped part attribute.
  const root = page.locator('[data-qr-code-root]').filter({
    has: page.getByTestId('machine-qr-frame'),
  });
  const frame = page.getByTestId('machine-qr-frame');
  const path = frame.locator('path');
  await expect(root).toHaveAttribute('data-qr-code-root');
  // Zag 2 writes no `id` from `ids` for parts nothing references.
  await expect(frame).toHaveAttribute('data-qr-code-frame');
  await expect(page.getByTestId('machine-qr-value')).toHaveText('Initial QR');
  await expect(page.getByTestId('machine-qr-reported')).toHaveText('none');
  const initialPath = await path.getAttribute('d');
  const initialViewBox = await frame.getAttribute('viewBox');
  expect(initialPath).toBeTruthy();
  expect(initialViewBox).toBeTruthy();

  await page.getByTestId('machine-qr-ecc-high').click();
  await expect(path).not.toHaveAttribute('d', initialPath ?? '');
  await page.getByTestId('machine-qr-ecc-low').click();
  await expect(path).toHaveAttribute('d', initialPath ?? '');
  await page.getByTestId('machine-qr-boost').click();
  await expect(path).not.toHaveAttribute('d', initialPath ?? '');
  const boostedPath = await path.getAttribute('d');

  await page.getByTestId('machine-qr-pixels').click();
  const initialWidth = Number(initialViewBox?.split(' ')[2]);
  await expect(frame).toHaveAttribute('viewBox', `0 0 ${initialWidth * 2} ${initialWidth * 2}`);
  await expect(path).not.toHaveAttribute('d', boostedPath ?? '');
  await page.getByTestId('machine-qr-value-toggle').click();
  await expect(page.getByTestId('machine-qr-value')).toHaveText('Updated QR');
  await expect(page.getByTestId('machine-qr-reported')).toHaveText('Updated QR');
}

test('QR machine preserves uncontrolled state and encoding controls', verifiesQrMachine);

/** Check that changing the QR payload changes the downloaded PNG. */
async function verifiesDownloadPayload({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-qr-code-machine--contract');
  const firstDownload = page.waitForEvent('download');
  await page.getByTestId('machine-qr-download').click();
  const first = await firstDownload;
  const firstBytes = await readFile(await first.path());
  expect(first.suggestedFilename()).toBe('machine-qr.png');
  expect(firstBytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  await page.getByTestId('machine-qr-value-toggle').click();
  const secondDownload = page.waitForEvent('download');
  await page.getByTestId('machine-qr-download').click();
  const second = await secondDownload;
  const secondBytes = await readFile(await second.path());
  expect(secondBytes.equals(firstBytes)).toBe(false);
}

test('QR download encodes the current value', verifiesDownloadPayload);
