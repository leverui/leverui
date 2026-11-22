import { readFile } from 'node:fs/promises';
import { expect, test, type Page, type Route } from '@playwright/test';

/** Activate a story and read the browser's saved file. */
async function downloadStory(page: Page, story: string): Promise<{ name: string; body: string }> {
  await page.goto(`/iframe.html?id=components-download-trigger--${story}`);
  const pendingDownload = page.waitForEvent('download');
  await page.locator('#storybook-root button').click();
  const download = await pendingDownload;
  const path = await download.path();
  if (!path) throw new Error('Browser download path is unavailable.');
  return { name: download.suggestedFilename(), body: await readFile(path, 'utf8') };
}

/** Verify the text and SVG examples save their expected payloads. */
async function verifiesStaticDownloads({ page }: { page: Page }): Promise<void> {
  const basic = await downloadStory(page, 'basic');
  expect(basic.name).toBe('sample.txt');
  expect(basic.body).toBe('The quick brown fox jumps over the lazy dog');
  await page.goto('/iframe.html?id=components-download-trigger--file-size');
  await expect(page.locator('#storybook-root button')).toContainText('43B');
  const sized = await downloadStory(page, 'file-size');
  expect(sized.body).toBe(basic.body);
  const svg = await downloadStory(page, 'svg');
  expect(svg.name).toBe('sample.svg');
  expect(svg.body).toContain('<circle cx="50" cy="50" r="40"');
}

/** Verify the image promise fetches only when activated and saves its Blob. */
async function verifiesAsyncDownload({ page }: { page: Page }): Promise<void> {
  let requests = 0;

  /** Serve a deterministic image payload without a network dependency. */
  async function serveImage(route: Route): Promise<void> {
    requests += 1;
    await route.fulfill({
      status: 200,
      contentType: 'image/webp',
      headers: { 'access-control-allow-origin': '*' },
      body: 'fake-webp',
    });
  }

  await page.route('/demo-images/scenes/mountains.webp', serveImage);
  await page.goto('/iframe.html?id=components-download-trigger--promise');
  expect(requests).toBe(0);
  const pendingDownload = page.waitForEvent('download');
  await page.locator('#storybook-root button').click();
  const download = await pendingDownload;
  expect(download.suggestedFilename()).toBe('mountains.webp');
  expect(requests).toBe(1);
  const path = await download.path();
  if (!path) throw new Error('Browser download path is unavailable.');
  expect(await readFile(path, 'utf8')).toBe('fake-webp');
}

test('Download Trigger saves text and SVG payloads', verifiesStaticDownloads);
test('Download Trigger resolves its image promise on click', verifiesAsyncDownload);
