import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'accepted-files',
  'basic',
  'custom-preview',
  'directory',
  'open-from-dialog',
  'media-capture',
  'multiple',
  'dropzone',
  'conditional-dropzone',
  'hook-form',
  'input',
  'input-clear',
  'paste-event',
  'store',
] as const;

/** Open a File Upload canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-file-upload--${id}`);
}

/** Build a browser file selection with a declared MIME type. */
function sampleFile(name: string, mimeType = 'text/plain') {
  return { name, mimeType, buffer: Buffer.from(`contents of ${name}`) };
}

/** Require every story to mount without a Storybook error. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await openStory(page, id);
    await expect(page.locator('#storybook-root > *')).not.toHaveCount(0);
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Check the picker accepts files and enforces the attributes. */
async function verifiesNativePicker({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  const chooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Upload file' }).click();
  const chooser = await chooserPromise;
  await chooser.setFiles(sampleFile('notes.txt'));
  await expect(page.getByText('notes.txt')).toBeVisible();

  await openStory(page, 'accepted-files');
  await expect(page.locator('input[type="file"]')).toHaveAttribute('accept', 'image/png');

  await openStory(page, 'directory');
  await expect(page.locator('input[type="file"]')).toHaveAttribute('webkitdirectory', '');

  await openStory(page, 'media-capture');
  await expect(page.locator('input[type="file"]')).toHaveAttribute('capture', 'environment');
}

/** Exercise multi-file rows and the conditional allowance. */
async function verifiesFileCounts({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'multiple');
  await page
    .locator('input[type="file"]')
    .setInputFiles([sampleFile('alpha.txt'), sampleFile('beta.txt')]);
  await expect(page.getByText('alpha.txt', { exact: true })).toBeVisible();
  await expect(page.getByText('beta.txt', { exact: true })).toBeVisible();

  await openStory(page, 'conditional-dropzone');
  await expect(page.getByText('3 more files allowed')).toBeVisible();
  await page
    .locator('input[type="file"]')
    .setInputFiles([sampleFile('one.txt'), sampleFile('two.txt'), sampleFile('three.txt')]);
  await expect(page.getByText('3 more files allowed')).toHaveCount(0);
  await expect(page.locator('[data-file-upload-dropzone]')).toHaveCount(0);
}

test('all File Upload stories render', verifiesInventory);
test('File Upload native picker and attributes work', verifiesNativePicker);
test('File Upload multiple and conditional counts work', verifiesFileCounts);
