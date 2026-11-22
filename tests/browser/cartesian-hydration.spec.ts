import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderCartesianHydrationTree,
  type CartesianHydrationComponents,
} from '../../.storybook/cartesian-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as CartesianHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Keep one server node marked across the hydration boundary. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate one published chart family in the browser. */
async function hydrateInBrowser(kind: 'area' | 'line'): Promise<void> {
  const modulePath = '/.storybook/cartesian-hydration-example.tsx';
  const { hydrateCartesianExample } = await import(modulePath);
  const target = document.getElementById('cartesian-hydration-root');
  if (!target) throw new Error('Cartesian hydration root was not found.');
  hydrateCartesianExample(target, kind);
}

/** Preserve server chart nodes and keyboard tooltip behavior through hydration. */
async function verifyHydration(page: Page, kind: 'area' | 'line'): Promise<void> {
  const markup = renderToString(
    /** Render the published server entry with the shared chart fixture. */
    () => renderCartesianHydrationTree(server, kind),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="cartesian-hydration-root">${markup}</div>`,
  );
  const root = page.locator('.leverui-cartesian-chart__root');
  const svg = root.locator('.leverui-cartesian-chart__svg');
  await root.evaluate(markServerNode);
  await svg.evaluate(markServerNode);
  await expect(root).toHaveCSS('min-width', '280px');
  const errors: string[] = [];
  /** Capture client errors while the chart attaches and receives focus. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }
  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser, kind);
  await expect(page.locator('#cartesian-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(svg).toHaveAttribute('data-server-node', 'true');
  await root.focus();
  await expect(root.getByRole('tooltip')).toBeVisible();
  expect(errors).toEqual([]);
}

test('published Area Chart hydrates its server nodes', async ({ page }) => {
  await verifyHydration(page, 'area');
});

test('published Line Chart hydrates its server nodes', async ({ page }) => {
  await verifyHydration(page, 'line');
});
