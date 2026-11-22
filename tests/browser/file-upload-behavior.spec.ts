import { expect, test, type Page } from '@playwright/test';

/** Open a File Upload behavior specimen after its machine has mounted. */
async function openStory(page: Page, name: string, inputTestId: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-file-upload-behavior--${name}`);
  await expect(page.getByTestId(inputTestId)).toHaveAttribute('type', 'file', {
    timeout: 30_000,
  });
}

/** Assert callback payloads and native validation for selected files. */
async function verifiesValidation({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'validation', 'validation-input');
  const input = page.getByTestId('validation-input');
  const events = page.getByTestId('validation-events');
  await expect(input).toHaveAttribute('accept', 'text/plain');
  await input.setInputFiles({
    name: 'notes.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('ok'),
  });
  await expect(page.getByTestId('validation-summary')).toHaveText('prepared-notes.txt');
  await expect(events).toContainText('transform');
  await expect(events).toContainText('accept:prepared-notes.txt');
  await expect(events).toContainText('change:1:0');
  await page.locator('[data-file-upload-item-delete-trigger]').click();
  await input.setInputFiles({
    name: 'photo.png',
    mimeType: 'image/png',
    buffer: Buffer.from('png'),
  });
  await expect(events).toContainText('reject:photo.png');
  await expect(events).toContainText('change:0:1');
  await input.setInputFiles({
    name: 'large.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('too large'),
  });
  await expect(events).toContainText('reject:large.txt');
}

/** Reject a batch that exceeds the machine's allowed file count. */
async function verifiesFileCount({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'count', 'count-input');
  const input = page.getByTestId('count-input');
  await expect(input).toHaveAttribute('multiple', '');
  await input.setInputFiles([
    { name: 'one.txt', mimeType: 'text/plain', buffer: Buffer.from('a') },
    { name: 'two.txt', mimeType: 'text/plain', buffer: Buffer.from('b') },
    { name: 'three.txt', mimeType: 'text/plain', buffer: Buffer.from('c') },
  ]);
  await expect(page.getByTestId('count-rejected')).toContainText('three.txt');
}

/** Drop an actual browser File on the machine-owned dropzone. */
async function verifiesDrop({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'validation', 'validation-input');
  await page.getByTestId('validation-dropzone').evaluate(
    /** Dispatch a browser drop with a file entry as supplied by native drags. */
    (element) => {
      const file = new File(['ok'], 'dropped.txt', { type: 'text/plain' });
      const transfer = {
        types: ['Files'],
        items: [
          {
            kind: 'file',
            /** Expose the entry metadata used by Zag's drop traversal. */
            getAsEntry: () => ({ isFile: true, isDirectory: false }),
            /** Return the actual browser File from the synthetic entry. */
            getAsFile: () => file,
          },
        ],
        dropEffect: 'copy',
      };
      for (const type of ['dragenter', 'dragover', 'drop']) {
        const event = new DragEvent(type, { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'dataTransfer', { value: transfer });
        element.dispatchEvent(event);
      }
    },
  );
  await expect(page.getByTestId('validation-summary')).toHaveText('prepared-dropped.txt');
}

/** Paste an actual clipboard File through the public machine accessor. */
async function verifiesPaste({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'validation', 'validation-input');
  await page.getByTestId('validation-dropzone').evaluate(
    /** Dispatch the browser clipboard event used by the public paste pattern. */
    (element) => {
      const transfer = new DataTransfer();
      transfer.items.add(new File(['ok'], 'pasted.txt', { type: 'text/plain' }));
      const pasteEvent = new ClipboardEvent('paste', { bubbles: true, clipboardData: transfer });
      if (pasteEvent.clipboardData?.files.length !== 1) {
        Object.defineProperty(pasteEvent, 'clipboardData', { value: transfer });
      }
      element.dispatchEvent(pasteEvent);
    },
  );
  await expect(page.getByTestId('validation-summary')).toHaveText('prepared-pasted.txt');
}

/** Keep an externally controlled selection and the native input stable. */
async function verifiesControlledFiles({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'controlled', 'controlled-input');
  const input = page.getByTestId('controlled-input');
  await input.evaluate(
    /** Mark the input before externally controlled state changes. */
    (element) => element.setAttribute('data-original', 'true'),
  );
  await page.getByTestId('controlled-external').click();
  await expect(page.getByTestId('controlled-summary')).toHaveText('external.txt');
  await input.setInputFiles({
    name: 'chosen.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('x'),
  });
  await expect(page.getByTestId('controlled-summary')).toHaveText('chosen.txt');
  await expect(input).toHaveAttribute('data-original', 'true');
}

/** Verify native directory and camera attributes where Chromium supports them. */
async function verifiesInputAttributes({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'attributes', 'attributes-input');
  const input = page.getByTestId('attributes-input');
  await expect(input).toHaveAttribute('capture', 'environment');
  await expect(input).toHaveAttribute('webkitdirectory', '');
}

/** Render rejected files through the public rejected item group contract. */
async function verifiesRejectedItems({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-file-upload-rejected--rejected');
  const input = page.getByTestId('rejected-input');
  await expect(input).toHaveAttribute('type', 'file', { timeout: 30_000 });
  await input.setInputFiles({
    name: 'photo.png',
    mimeType: 'image/png',
    buffer: Buffer.from('png'),
  });
  const group = page.getByTestId('rejected-group');
  await expect(group).toHaveAttribute('data-type', 'rejected');
  await expect(group.locator('[data-file-upload-item]')).toHaveAttribute('data-type', 'rejected');
  await expect(group.locator('[data-file-upload-item-name]')).toHaveText('photo.png');
}

test('File Upload validates files and reports callback payloads', verifiesValidation);
test('File Upload rejects file batches above the maximum count', verifiesFileCount);
test('File Upload accepts a native drop event', verifiesDrop);
test('File Upload accepts a native paste event through its accessor', verifiesPaste);
test('File Upload follows externally controlled files', verifiesControlledFiles);
test('File Upload forwards directory and capture input attributes', verifiesInputAttributes);
test('File Upload renders rejected file item parts', verifiesRejectedItems);
