import { expect, test, type Page } from '@playwright/test';

/** Verify authored CSS, consumer hooks, native file behavior, and unstyled parts. */
async function verifiesFileUploadCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-file-upload-css--contract');
  const root = page.getByTestId('file-css-root');
  const label = page.getByTestId('file-css-label');
  const input = page.getByTestId('file-css-hidden');
  const dropzone = page.getByTestId('file-css-dropzone');
  const list = page.getByTestId('file-css-list');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveClass(/leverui-file-upload__root/);
  await expect(root).toHaveAttribute('data-leverui-color-palette', 'blue');
  await expect(input).toHaveClass(/leverui-file-upload__hiddenInput/);
  await expect(dropzone).toHaveClass(/leverui-file-upload__dropzone/);
  await expect(dropzone).toHaveCSS('border-top-color', 'rgb(21, 87, 156)');
  await expect(dropzone).toHaveCSS('background-color', 'rgb(241, 247, 253)');
  await expect(label).toHaveCSS('color', 'rgb(73, 41, 133)');
  await expect(page.getByTestId('file-css-dropzone-content')).toHaveCSS('display', 'flex');
  await input.setInputFiles({
    name: 'report.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('ok'),
  });
  await expect(list).toContainText('report.txt');
  const item = list.locator('.leverui-file-upload__item');
  await expect(item).toHaveCSS('border-top-color', 'rgb(21, 87, 156)');
  await expect(item.locator('.leverui-file-upload__itemName')).toBeVisible();
  await expect(item.locator('.leverui-file-upload__itemDeleteTrigger')).toBeVisible();

  const unstyledRoot = page.getByTestId('file-css-unstyled-root');
  const unstyled = page.getByTestId('file-css-unstyled');
  await expect(unstyledRoot).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).toHaveCSS('background-color', 'rgb(112, 37, 97)');
  const part = page.getByTestId('file-css-part-unstyled');
  await expect(part).toHaveAttribute('data-unstyled', '');
  await expect(part).toHaveCSS('background-color', 'rgb(112, 37, 97)');
}

test(
  'File Upload uses authored CSS with consumer overrides and native behavior',
  verifiesFileUploadCss,
);
