import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderProgressCircleHydrationTree,
  type ProgressCircleHydrationComponents,
} from '../../.storybook/progress-circle-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ProgressCircleHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published Circle browser entry to existing server markup. */
async function hydrateProgressCircleInBrowser(): Promise<void> {
  const modulePath = '/.storybook/progress-circle-hydration-example.ts';
  const { hydrateProgressCircleExample } = await import(modulePath);
  const host = document.getElementById('progress-circle-hydration-root');
  if (!host) throw new Error('Progress Circle hydration root was not found.');
  hydrateProgressCircleExample(host);
}

/** Verify machine nodes, ARIA output, and authored CSS across hydration. */
async function verifiesProgressCircleHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Build the published server tree before attaching the browser bundle. */
    () => renderProgressCircleHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="progress-circle-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#progress-circle-hydration-root');
  const circle = page.locator('#hydrated-progress-circle-svg');
  const range = page.locator('#hydrated-progress-circle-range');
  await expect(circle).toHaveAttribute('aria-valuenow', '25');
  await expect(circle).toHaveCSS('width', '32px');
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
  await page.evaluate(hydrateProgressCircleInBrowser);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(range).toHaveAttribute('data-server-node', 'true');
  await page.locator('#progress-circle-hydration-toggle').click();
  await expect(circle).toHaveAttribute('aria-valuenow', '75');
  await expect(circle).toHaveCSS('width', '48px');
  await expect(range).toHaveAttribute('data-server-node', 'true');
  await expect(page.locator('#hydrated-progress-circle-value')).toHaveText('75%');
  await page.locator('#progress-circle-hydration-toggle').click();
  await expect(circle).toHaveAttribute('aria-valuenow', '25');
  expect(errors).toEqual([]);
}

test(
  'published Progress Circle hydrates its machine and authored CSS',
  verifiesProgressCircleHydration,
);
