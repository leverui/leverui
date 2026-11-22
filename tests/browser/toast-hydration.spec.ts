import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderToastHydrationTree,
  type ToastHydrationComponents,
} from '../../.storybook/toast-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ToastHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser entry to the server-rendered notification region. */
async function hydrateToastInBrowser(): Promise<void> {
  const modulePath = '/.storybook/toast-hydration-example.ts';
  const { hydrateToastExample } = await import(modulePath);
  const host = document.getElementById('toast-hydration-root');
  if (!host) throw new Error('Toast hydration root was not found.');
  hydrateToastExample(host);
}

/** Preserve server markup and create a toast after hydration. */
async function verifiesToastHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the initial empty group through the published server entry. */
    () => renderToastHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="toast-hydration-root">${markup}</div>`,
  );
  const host = page.locator('#toast-hydration-root');
  const region = page.locator('#hydrated-toast-region');
  await expect(region).toHaveAttribute('role', 'region');
  await region.evaluate(
    /** Mark the server region before attaching Solid. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record uncaught browser failures during hydration. */
  function recordPageError(error: Error): void {
    errors.push(error.message);
  }

  /** Record browser warnings that identify a hydration mismatch. */
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
  await page.evaluate(hydrateToastInBrowser);
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  await expect(region).toHaveAttribute('data-server-node', 'true');
  await page.locator('#toast-hydration-trigger').click();
  await expect(page.locator('#hydrated-toast')).toBeVisible();
  await expect(page.getByText('Hydrated toast', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
}

test('published Toast hydrates its region and creates a notification', verifiesToastHydration);
