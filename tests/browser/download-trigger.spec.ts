import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { scanWcagViolations } from './axe-scan';

/** Return a browser download's file name and exact UTF-8 content. */
async function activateDownload(
  page: Page,
  trigger: Locator,
): Promise<{ name: string; body: string }> {
  const [download] = await Promise.all([page.waitForEvent('download'), trigger.click()]);
  return {
    name: download.suggestedFilename(),
    body: await readFile(await download.path(), 'utf8'),
  };
}

/** Preserve the plain-text payload, native type, and consumer CSS hook. */
async function verifiesBasic({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-download-trigger--basic');
  const trigger = page.getByRole('button', { name: 'Download txt' });
  await expect(trigger).toHaveAttribute('type', 'button');
  await expect(trigger).toHaveClass(/lui-download-trigger/);
  await expect(trigger).toHaveCSS('color', 'rgb(9, 9, 11)');
  await page.addStyleTag({ content: '.download-override { color: rgb(1, 2, 3); }' });
  await expect(trigger).toHaveCSS('color', 'rgb(1, 2, 3)');
  const result = await activateDownload(page, trigger);
  expect(result).toEqual({
    name: 'sample.txt',
    body: 'The quick brown fox jumps over the lazy dog',
  });
}

test('DownloadTrigger saves a native text button', verifiesBasic);

/** Keep the child button's ref, keyboard action, and downloaded data. */
async function verifiesStyledChild({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-download-trigger--styled-button');
  const trigger = page.getByTestId('styled-download');
  await expect(trigger).toHaveClass(/lui-button/);
  await expect(trigger).toHaveClass(/lui-download-trigger/);
  await expect(trigger).toHaveAttribute('data-download-ref', 'BUTTON');
  await trigger.focus();
  const downloadPromise = page.waitForEvent('download');
  await page.keyboard.press('Enter');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('styled.txt');
  expect(await readFile(await download.path(), 'utf8')).toBe(
    'The quick brown fox jumps over the lazy dog',
  );
}

test('DownloadTrigger keeps a custom Button interactive', verifiesStyledChild);

/** Preserve SVG bytes and the requested file extension. */
async function verifiesSvg({ page }: { page: Page }): Promise<void> {
  await page.addInitScript(
    /** Observe the Blob type handed to the browser download API. */
    () => {
      const createObjectURL = URL.createObjectURL.bind(URL);
      /** Capture the browser's Blob MIME type before creating its URL. */
      URL.createObjectURL = (value: Blob | MediaSource): string => {
        if (value instanceof Blob) {
          (window as Window & { downloadedMimeType?: string }).downloadedMimeType = value.type;
        }
        return createObjectURL(value);
      };
    },
  );
  await page.goto('/iframe.html?id=components-download-trigger--svg');
  const result = await activateDownload(page, page.getByRole('button', { name: 'Download svg' }));
  expect(result.name).toBe('circle.svg');
  expect(result.body).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
  expect(result.body).toContain('fill="red"');
  expect(
    await page.evaluate(
      /** Read the MIME type observed at the browser API boundary. */
      () => (window as Window & { downloadedMimeType?: string }).downloadedMimeType,
    ),
  ).toBe('image/svg+xml');
}

test('DownloadTrigger saves SVG data', verifiesSvg);

/** Resolve promise data at click time and save the Blob exactly once. */
async function verifiesPromise({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-download-trigger--promise-data');
  const requests = page.getByTestId('download-requests');
  await expect(requests).toHaveText('0');
  const result = await activateDownload(page, page.getByRole('button', { name: 'Download async' }));
  expect(result).toEqual({ name: 'async.txt', body: 'async content' });
  await expect(requests).toHaveText('1');
}

test('DownloadTrigger resolves a promise payload on activation', verifiesPromise);

/** Read reactive data and filename after the caller changes them. */
async function verifiesReactive({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-download-trigger--file-size');
  const trigger = page.getByRole('button', { name: /Download/ });
  await expect(trigger).toContainText('43');
  await page.getByRole('button', { name: 'Switch content' }).click();
  await expect(trigger).toContainText('49');
  const result = await activateDownload(page, trigger);
  expect(result).toEqual({
    name: 'expanded.txt',
    body: 'The quick brown fox jumps over the lazy dog again',
  });
}

test('DownloadTrigger follows reactive content and formatted size', verifiesReactive);

/** Expose the primitive's imperative hook as a standalone public API. */
async function verifiesHook({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-download-trigger--hook');
  const result = await activateDownload(
    page,
    page.getByRole('button', { name: 'Download with hook' }),
  );
  expect(result.name).toBe('hook.txt');
  expect(result.body).toContain('quick brown fox');
}

test('useDownload saves data without the trigger component', verifiesHook);

/** Respect a caller's prevented click before invoking the primitive download hook. */
async function verifiesCancellation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-download-trigger--cancelled');
  const downloaded = page.waitForEvent('download', { timeout: 500 }).then(
    /** Report an unexpected browser download. */
    () => true,
    /** A timed-out event means the caller successfully cancelled it. */
    () => false,
  );
  await page.getByRole('button', { name: 'Cancel download' }).click();
  await expect(page.getByTestId('cancelled-clicks')).toHaveText('1');
  expect(await downloaded).toBe(false);
}

test('DownloadTrigger honors a prevented click', verifiesCancellation);

/** Confirm native disabled semantics stop the download handler. */
async function verifiesDisabled({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-download-trigger--disabled');
  const trigger = page.getByRole('button', { name: 'Disabled download' });
  await expect(trigger).toBeDisabled();
  const downloaded = page.waitForEvent('download', { timeout: 500 }).then(
    /** Report an unexpected download from the disabled button. */
    () => true,
    /** The disabled click correctly produced no download event. */
    () => false,
  );
  await trigger.evaluate(
    /** Ask the browser to activate the disabled native button. */
    (button: HTMLButtonElement) => button.click(),
  );
  expect(await downloaded).toBe(false);
}

test('DownloadTrigger keeps a disabled button inert', verifiesDisabled);

/** Scan the native and child button forms for common WCAG failures. */
async function verifiesAccessibility({ page }: { page: Page }): Promise<void> {
  for (const story of [
    '/iframe.html?id=components-download-trigger--basic',
    '/iframe.html?id=components-download-trigger--styled-button',
  ]) {
    await page.goto(story);
    await expect(page.getByRole('button')).toBeVisible();
    const violations = await scanWcagViolations(page);
    expect(violations, story).toEqual([]);
  }
}

test(
  'DownloadTrigger native and styled buttons have no common WCAG violations',
  verifiesAccessibility,
);
