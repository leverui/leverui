import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { CenterHydrationComponents } from '../../.storybook/center-hydration-tree';
import { renderCenterHydrationTree } from '../../.storybook/center-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as CenterHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser Center behavior to published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/center-hydration-example.tsx';
  const { hydrateCenterExample } = await import(modulePath);
  const root = document.getElementById('center-hydration-root');
  if (!root) throw new Error('Center hydration root was not found.');
  hydrateCenterExample(root);
}

/** Verify node reuse and live display changes after published SSR hydration. */
async function verifiesCenterHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderCenterHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="center-hydration-root">${markup}</div>`,
  );
  const center = page.locator('#hydrated-center');
  const child = page.locator('#hydrated-center-child');
  await expect(center).toHaveCSS('display', 'flex');
  await center.evaluate(
    /** Mark the server root to detect replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the server child to detect replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  const errors: string[] = [];

  /** Capture errors from attachment and the live display update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#center-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(center).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-center-toggle').click();
  expect(errors).toEqual([]);
  await expect(center).toHaveAttribute('data-inline', 'true');
  await expect(center).toHaveCSS('display', 'inline-flex');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test(
  'published Center hydrates and changes display without replacing nodes',
  verifiesCenterHydration,
);
