import { expect } from '@playwright/test';

/** Verify installed File Upload selection, removal, and CSS customization. */
export async function verifyPackedFileUpload(page) {
  const root = page.getByTestId('packed-file-upload-root');
  const input = page.getByTestId('packed-file-upload-input');
  const dropzone = page.getByTestId('packed-file-upload-dropzone');
  const text = page.getByTestId('packed-file-upload-text');
  await expect(root).toHaveClass(/lui-file-upload__root/);
  await expect(input).toHaveAttribute('type', 'file');
  await expect(dropzone).toHaveCSS('background-color', 'rgb(30, 40, 90)');
  await input.setInputFiles({
    name: 'report.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('ok'),
  });
  await expect(text).toHaveText('report.txt');
  await root.locator('[data-file-upload-item-delete-trigger]').click();
  await expect(text).toHaveText('Select file(s)');
  await page.getByTestId('packed-file-upload-toggle').click();
  await expect(input).toBeDisabled();
}
