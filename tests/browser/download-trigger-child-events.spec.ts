import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/** Confirm both child and trigger callbacks run before the file is saved. */
async function verifiesComposedClick({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-download-trigger-child-events--composed');
  const trigger = page.getByRole('button', { name: 'Download with child handler' });
  const [download] = await Promise.all([page.waitForEvent('download'), trigger.click()]);
  await expect(page.getByTestId('child-event-sequence')).toHaveText('child,parent');
  expect(download.suggestedFilename()).toBe('child-events.txt');
  expect(await readFile(await download.path(), 'utf8')).toBe('child event content');
}

test('DownloadTrigger composes a child click before its own click', verifiesComposedClick);

/** Confirm a child's prevented click reaches the parent but saves no file. */
async function verifiesChildCancellation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-download-trigger-child-events--cancelled');
  const downloaded = page.waitForEvent('download', { timeout: 500 }).then(
    /** Report an unexpected file after child cancellation. */
    () => true,
    /** A timeout confirms that the browser received no download. */
    () => false,
  );
  await page.getByRole('button', { name: 'Cancel child download' }).click();
  await expect(page.getByTestId('child-event-sequence')).toHaveText('child,parent');
  expect(await downloaded).toBe(false);
}

test('DownloadTrigger lets a styled child cancel the download', verifiesChildCancellation);
