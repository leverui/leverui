import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { SquareHydrationComponents } from '../../.storybook/square-hydration-tree';
import { renderSquareHydrationTree } from '../../.storybook/square-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as SquareHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser Square behavior to published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/square-hydration-example.tsx';
  const { hydrateSquareExample } = await import(modulePath);
  const root = document.getElementById('square-hydration-root');
  if (!root) throw new Error('Square hydration root was not found.');
  hydrateSquareExample(root);
}

/** Verify hydration retains native nodes and reactive equal sizing. */
async function verifiesSquareHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderSquareHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="square-hydration-root">${markup}</div>`,
  );
  const square = page.locator('#hydrated-square');
  const child = page.locator('#hydrated-square-child');
  await expect(square).toHaveCSS('width', '32px');
  await expect(square).toHaveCSS('height', '32px');
  await square.evaluate(
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

  /** Collect browser errors from attachment and the size update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#square-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(square).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-square-toggle').click();
  await expect(square).toHaveCSS('width', '48px');
  await expect(square).toHaveCSS('height', '48px');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Square hydrates and changes size without replacing nodes', verifiesSquareHydration);
