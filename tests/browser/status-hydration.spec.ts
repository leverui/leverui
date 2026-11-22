import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderStatusHydrationTree,
  type StatusHydrationComponents,
} from '../../.storybook/status-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as StatusHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate published Status on the browser test page. */
async function hydrateStatusInBrowser(): Promise<void> {
  const modulePath = '/.storybook/status-hydration-example.ts';
  const { hydrateStatusExample } = await import(modulePath);
  const root = document.getElementById('status-hydration-root');
  if (!root) throw new Error('Status hydration root was not found.');
  hydrateStatusExample(root);
}

/** Verify native node identity and live palette styles after hydration. */
async function verifiesStatusHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Use the package server entry for the first render. */
    () => renderStatusHydrationTree(server),
  );
  expect(markup).toContain('id="hydrated-status"');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="status-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-status');
  const indicator = page.locator('#hydrated-status-indicator');
  await expect(root).toHaveJSProperty('tagName', 'DIV');
  await expect(indicator).toHaveJSProperty('tagName', 'DIV');
  const initialColor = await indicator.evaluate(
    /** Capture the server-rendered palette color. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await root.evaluate(
    /** Mark the server root before attaching client behavior. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect uncaught hydration failures. */
  function recordPageError(error: Error): void {
    errors.push(error.message);
  }

  /** Collect console warnings about mismatched markup. */
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
  await page.evaluate(hydrateStatusInBrowser);
  await expect(page.locator('#status-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await page.locator('#status-hydration-toggle').click();
  await expect(indicator).not.toHaveCSS('background-color', initialColor);
  expect(errors).toEqual([]);
}

test('published Status hydrates with reactive palette and stable nodes', verifiesStatusHydration);
