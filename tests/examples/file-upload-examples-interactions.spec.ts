import { expect, test, type Page } from '@playwright/test';

/** Open a File Upload canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-file-upload--${id}`);
}

/** Build a text selection for the native file input. */
function sampleFile(name: string, size = 12) {
  return { name, mimeType: 'text/plain', buffer: Buffer.alloc(size, 'x') };
}

/** Check validation feedback and a field-like chooser's clear action. */
async function verifiesFormAndClear({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('At least one image is required')).toBeVisible();
  await page.locator('input[type="file"]').setInputFiles(sampleFile('picture.png'));
  await expect(page.getByText('At least one image is required')).toHaveCount(0);

  await openStory(page, 'input-clear');
  await page.locator('input[type="file"]').setInputFiles(sampleFile('attachment.txt'));
  await expect(page.getByText('attachment.txt', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Clear file' }).click();
  await expect(page.getByText('Select file(s)')).toBeVisible();
}

/** Check that a caller-owned machine reports accepted and oversized files. */
async function verifiesStore({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'store');
  await page.locator('input[type="file"]').setInputFiles(sampleFile('small.txt'));
  await expect(page.getByText('accepted: small.txt')).toBeVisible();
  await page.locator('input[type="file"]').setInputFiles(sampleFile('large.txt', 3500));
  await expect(page.getByText('rejected: large.txt')).toBeVisible();
}

/** Open the nested dialog and choose a file from its dropzone. */
async function verifiesDialog({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'open-from-dialog');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog', { name: 'Upload a file' })).toBeVisible();
  await page.locator('input[type="file"]').setInputFiles(sampleFile('dialog.txt'));
  await expect(page.getByText('dialog.txt', { exact: true })).toBeVisible();
}

/** Check image previews and clipboard file selection. */
async function verifiesPreviewAndPaste({ page }: { page: Page }): Promise<void> {
  const image = {
    name: 'pixel.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',
      'base64',
    ),
  };
  await openStory(page, 'custom-preview');
  await page.locator('input[type="file"]').setInputFiles(image);
  await expect(page.locator('[data-file-upload-item-preview-image]')).toBeVisible();
  await page.getByRole('button', { name: 'Remove pixel.png' }).click();
  await expect(page.locator('[data-file-upload-item]')).toHaveCount(0);

  await openStory(page, 'paste-event');
  await page.getByPlaceholder('Paste image here...').evaluate(
    /** Send a real ClipboardEvent with one image file to the input. */
    (input) => {
      const transfer = new DataTransfer();
      transfer.items.add(new File(['image'], 'pasted.png', { type: 'image/png' }));
      input.dispatchEvent(new ClipboardEvent('paste', { clipboardData: transfer, bubbles: true }));
    },
  );
  await expect(page.locator('[data-file-upload-item-preview-image]')).toBeVisible();
}

test('File Upload form and clear interactions work', verifiesFormAndClear);
test('File Upload external store reports file changes', verifiesStore);
test('File Upload works inside a dialog', verifiesDialog);
test('File Upload previews and pastes image files', verifiesPreviewAndPaste);
