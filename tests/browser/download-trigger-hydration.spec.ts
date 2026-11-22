import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser entry to the server-rendered download tree. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/download-trigger-hydration-example.tsx';
  const { hydrateDownloadTriggerExample } = await import(modulePath);
  const host = document.getElementById('download-trigger-hydration-root');
  if (!host) throw new Error('The DownloadTrigger hydration host was not found.');
  hydrateDownloadTriggerExample(host);
}

/** Preserve the server node without generating presentation while hydrating. */
async function verifiesDownloadHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/download-trigger-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="download-trigger-hydration-root">${markup}</div>`,
  );
  const host = page.locator('#download-trigger-hydration-root');
  const trigger = host.getByRole('button', { name: 'Hydrated download' });
  await expect(trigger).toHaveAttribute('type', 'button');
  await trigger.evaluate(
    /** Mark the exact server button before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect browser exceptions during hydration and activation. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  /** Collect hydration warnings and console errors. */
  function recordConsole(message: { type(): string; text(): string }): void {
    if (
      message.type() === 'error' ||
      /^Hydration\b|Hydration (mismatch|key miss|tag mismatch|structure mismatch)/i.test(
        message.text(),
      )
    )
      errors.push(message.text());
  }

  page.on('pageerror', recordError);
  page.on('console', recordConsole);
  await page.evaluate(hydrateInBrowser);
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  await expect(trigger).toHaveAttribute('data-server-node', 'true');
  const downloadPromise = page.waitForEvent('download');
  await trigger.focus();
  await trigger.press('Enter');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('hydrated.txt');
  expect(await readFile(await download.path(), 'utf8')).toBe('hydrated download content');
  expect(errors).toEqual([]);
}

test(
  'published DownloadTrigger hydrates its server button and downloads',
  verifiesDownloadHydration,
);
