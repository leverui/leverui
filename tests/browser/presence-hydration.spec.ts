import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { Presence as PresenceExport } from '../../src';
import {
  renderPresenceHydrationTree,
  type PresenceHydrationOptions,
} from '../../.storybook/presence-hydration-tree';

type ServerExports = {
  Presence: typeof PresenceExport;
};
const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Load the browser implementation after inserting published server HTML. */
async function hydratePresenceInBrowser(options: PresenceHydrationOptions): Promise<void> {
  const modulePath = '/.storybook/presence-hydration-example.tsx';
  const { hydratePresenceExample } = await import(modulePath);
  const root = document.getElementById('presence-hydration-root');
  if (!root) throw new Error('Presence hydration root was not found.');
  hydratePresenceExample(root, options);
}

/** Keep the original Presence node and react to state after hydration. */
async function verifiesPresenceHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render through the published package's server entry. */
    () => renderPresenceHydrationTree(components, { initialPresent: true }),
  );
  expect(markup).toContain('Hydrated presence');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="presence-hydration-root">${markup}</div>`,
  );
  const content = page.getByTestId('presence-hydrated-content');
  await expect(content).toHaveCount(1);
  await content.evaluate(
    /** Mark the existing server node before running browser code. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  const errors: string[] = [];

  /** Collect exceptions from the hydration and state transition. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePresenceInBrowser, { initialPresent: true });
  await expect(page.locator('#presence-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(content).toHaveAttribute('data-server-element', 'true');
  await page.getByTestId('presence-hydration-toggle').click();
  await expect(content).toBeHidden();
  await page.getByTestId('presence-hydration-toggle').click();
  await expect(content).toBeVisible();
  await expect(content).toHaveCount(1);
  expect(errors).toEqual([]);
}

test('published Presence hydrates and follows controlled state', verifiesPresenceHydration);

/** Hydrate an initially absent node, then mount it through controlled state. */
async function verifiesLazyPresenceHydration({ page }: { page: Page }): Promise<void> {
  const options: PresenceHydrationOptions = { initialPresent: false, lazyMount: true };
  const markup = renderToString(
    /** Render the same lazy tree that the browser will hydrate. */
    () => renderPresenceHydrationTree(components, options),
  );
  expect(markup).not.toContain('Hydrated presence');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="presence-hydration-root">${markup}</div>`,
  );
  const content = page.getByTestId('presence-hydrated-content');
  await expect(content).toHaveCount(0);
  const errors: string[] = [];

  /** Collect exceptions during hydration and insertion. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePresenceInBrowser, options);
  await expect(page.locator('#presence-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(content).toHaveCount(0);
  await page.getByTestId('presence-hydration-toggle').click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('data-state', 'open');
  await expect(content).toHaveCSS('padding-top', '16px');
  await expect(content).toHaveCount(1);
  expect(errors).toEqual([]);
}

test('published lazy Presence hydrates before first mount', verifiesLazyPresenceHydration);
