import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderProgressHydrationTree,
  type ProgressHydrationComponents,
} from '../../.storybook/progress-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ProgressHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published Progress browser entry to existing server markup. */
async function hydrateProgressInBrowser(): Promise<void> {
  const modulePath = '/.storybook/progress-hydration-example.ts';
  const { hydrateProgressExample } = await import(modulePath);
  const host = document.getElementById('progress-hydration-root');
  if (!host) throw new Error('Progress hydration root was not found.');
  hydrateProgressExample(host);
}

/** Verify machine nodes, ARIA output, and authored CSS across hydration. */
async function verifiesProgressHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Build the published server tree before attaching the browser bundle. */
    () => renderProgressHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="progress-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#progress-hydration-root');
  const track = page.locator('#hydrated-progress-track');
  const range = page.locator('#hydrated-progress-range');
  await expect(track).toHaveAttribute('aria-valuenow', '25');
  await expect(track).toHaveCSS('height', '8px');
  await range.evaluate(
    /** Mark the server range before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record uncaught browser errors. */
  function recordPageError(error: Error): void {
    errors.push(error.message);
  }

  /** Record hydration mismatch warnings. */
  function recordConsole(message: { type(): string; text(): string }): void {
    if (
      /error|warning/.test(message.type()) &&
      /^Hydration\b|Hydration (mismatch|key miss|tag mismatch|structure mismatch)/i.test(
        message.text(),
      )
    ) {
      errors.push(message.text());
    }
  }

  page.on('pageerror', recordPageError);
  page.on('console', recordConsole);
  await page.evaluate(hydrateProgressInBrowser);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(range).toHaveAttribute('data-server-node', 'true');
  await page.locator('#progress-hydration-toggle').click();
  await expect(track).toHaveAttribute('aria-valuenow', '75');
  await expect(track).toHaveCSS('height', '12px');
  await expect(range).toHaveAttribute('data-server-node', 'true');
  await expect(page.locator('#hydrated-progress-value')).toHaveText('75%');
  await page.locator('#progress-hydration-toggle').click();
  await expect(track).toHaveAttribute('aria-valuenow', '25');
  expect(errors).toEqual([]);
}

test('published Progress hydrates its machine and authored CSS', verifiesProgressHydration);
