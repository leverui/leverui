import { expect, test, type Page } from '@playwright/test';

/** Verify installed browser behavior through the public Storybook composition. */
async function verifiesFileUploadBrowser({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-file-upload--contract');
  const root = page.getByTestId('file-upload-root');
  const input = page.getByTestId('file-upload-input');
  const dropzone = page.getByTestId('file-upload-dropzone');
  const fileText = page.getByTestId('file-upload-text');
  await expect(input).toHaveAttribute('type', 'file', { timeout: 30_000 });
  await expect(root).toHaveClass(/lui-file-upload__root/);
  await expect(root).toHaveCSS('display', 'flex');
  await expect(dropzone).toHaveCSS('border-style', 'dashed');
  await expect(fileText).toHaveAttribute('data-placeholder', '');
  await input.setInputFiles({
    name: 'notes.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('note'),
  });
  await expect(fileText).toHaveText('notes.txt');
  await expect(root.locator('[data-file-upload-item]')).toHaveCount(1);
  await expect(root.locator('[data-file-upload-item-name]')).toHaveText('notes.txt');
  await root.locator('[data-file-upload-item-delete-trigger]').click();
  await expect(root.locator('[data-file-upload-item]')).toHaveCount(0);
  await expect(fileText).toHaveText('Select file(s)');
  await page.getByTestId('file-upload-toggle').click();
  await expect(input).toBeDisabled();
  await expect(page.getByTestId('file-upload-trigger')).toBeDisabled();
  await page.addStyleTag({
    content: '[data-testid="file-upload-contract"] { --lui-colors-bg: rgb(30, 40, 90); }',
  });
  await expect(dropzone).toHaveCSS('background-color', 'rgb(30, 40, 90)');
}

test('File Upload selects and removes files with reactive native state', verifiesFileUploadBrowser);
