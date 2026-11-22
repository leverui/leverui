import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderAlertHydrationTree,
  type AlertHydrationComponents,
} from '../../.storybook/alert-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as AlertHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published client Alert to the current server-rendered host. */
async function hydrateAlertInBrowser(): Promise<void> {
  const modulePath = '/.storybook/alert-hydration-example.ts';
  const { hydrateAlertExample } = await import(modulePath);
  const root = document.getElementById('alert-hydration-root');
  if (!root) throw new Error('Alert hydration root was not found.');
  hydrateAlertExample(root);
}

/** Verify stable nodes, styles, and inherited state across hydration. */
async function verifiesAlertHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the published server tree before client attachment. */
    () => renderAlertHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="alert-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-alert');
  const indicator = page.locator('#hydrated-alert-indicator');
  await expect(root).toHaveAttribute('role', 'status');
  await expect(indicator.locator('svg')).toHaveAttribute('aria-hidden', 'true');
  const initialColor = await root.evaluate(
    /** Capture the server-rendered Alert palette. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  const initialPath = await indicator.locator('path').getAttribute('d');
  await root.evaluate(
    /** Mark the original server root before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect uncaught client hydration failures. */
  function recordPageError(error: Error): void {
    errors.push(error.message);
  }

  /** Capture markup mismatch warnings in the browser console. */
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
  await page.evaluate(hydrateAlertInBrowser);
  await expect(page.locator('#alert-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await page.locator('#alert-hydration-toggle').click();
  await expect(root).not.toHaveCSS('background-color', initialColor);
  await expect(root).toHaveCSS('font-size', '16px');
  expect(await indicator.locator('path').getAttribute('d')).not.toBe(initialPath);
  expect(errors).toEqual([]);
}

test('published Alert hydrates with reactive status and stable nodes', verifiesAlertHydration);
