import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { FileUploadHydrationComponents } from '../../.storybook/file-upload-hydration-tree';
import { renderFileUploadHydrationTree } from '../../.storybook/file-upload-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as FileUploadHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the client File Upload tree to its published server markup. */
async function hydrateFileUploadInBrowser(): Promise<void> {
  const modulePath = '/.storybook/file-upload-hydration-example.tsx';
  const { hydrateFileUploadExample } = await import(modulePath);
  const root = document.getElementById('file-upload-hydration-root');
  if (!root) throw new Error('File Upload hydration root was not found.');
  hydrateFileUploadExample(root);
}

/** Verify input identity, selected value, association IDs, and style reuse. */
async function verifiesFileUploadHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared public tree through the published server entry. */
    () => renderFileUploadHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="file-upload-hydration-root">${markup}</div>`,
  );
  const input = page.locator('#file-upload-hydration-root input[type="file"]');
  const upload = page.getByTestId('hydrated-file-upload-root');
  const inputId = await input.getAttribute('id');
  await expect(page.getByText('Choose attachment')).toHaveAttribute('for', inputId ?? '');
  await expect(page.locator('[id="field::hydrated-attachment-field::helper-text"]')).toHaveText(
    'Select a text file',
  );
  await input.evaluate(
    /** Mark the server-rendered input before client attachment. */
    (element) => element.setAttribute('data-server-element', 'true'),
  );
  await input.setInputFiles({
    name: 'before.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('old'),
  });
  const errors: string[] = [];

  /** Capture hydration and interaction failures in Chromium. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateFileUploadInBrowser);
  await expect(page.locator('#file-upload-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(input).toHaveAttribute('data-server-element', 'true');
  expect(
    await input.evaluate(
      /** Read the file selected before the client attached. */
      (element) => (element as HTMLInputElement).files?.item(0)?.name,
    ),
  ).toBe('before.txt');
  await expect(upload).toHaveAttribute('data-file-upload-root');
  await expect(input).toHaveAttribute('aria-describedby', /helper-text/);
  await input.setInputFiles({
    name: 'after.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('new'),
  });
  await expect(page.locator('#hydrated-file-upload-text')).toHaveText('after.txt');
  await input.setInputFiles({
    name: 'again.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('newer'),
  });
  await expect(page.locator('#hydrated-file-upload-text')).toHaveText('again.txt');
  expect(errors).toEqual([]);
}

test('published File Upload hydrates its native input and styles', verifiesFileUploadHydration);
