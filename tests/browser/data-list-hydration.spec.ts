import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderDataListHydrationTree,
  type DataListHydrationComponents,
} from '../../.storybook/data-list-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as DataListHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser package to the server-rendered Data List. */
async function hydrateDataListInBrowser(): Promise<void> {
  const modulePath = '/.storybook/data-list-hydration-example.tsx';
  const { hydrateDataListExample } = await import(modulePath);
  const root = document.getElementById('data-list-hydration-root');
  if (!root) throw new Error('Data List hydration root was not found.');
  hydrateDataListExample(root);
}

/** Preserve semantic server nodes and update their styles after hydration. */
async function verifiesDataListHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Build the shared tree through the published server entry. */
    () => renderDataListHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="data-list-hydration-root">${markup}</div>`,
  );
  const list = page.locator('#hydrated-data-list');
  const item = page.locator('#hydrated-data-list-item');
  const value = page.locator('#hydrated-data-list-value');
  await expect(list).toHaveJSProperty('tagName', 'DL');
  await expect(value).toHaveText('Pending');
  await expect(item).toHaveCSS('flex-direction', 'column');
  await list.evaluate(
    /** Mark the original server-rendered list node. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await value.evaluate(
    /** Mark the original server-rendered description node. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect browser exceptions across hydration and updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateDataListInBrowser);
  await expect(page.locator('#data-list-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(list).toHaveAttribute('data-server-node', 'true');
  await expect(value).toHaveAttribute('data-server-node', 'true');
  await page.locator('#data-list-hydration-toggle').click();
  await expect(value).toHaveText('Complete');
  await expect(value).toHaveAttribute('data-server-node', 'true');
  await expect(item).toHaveCSS('flex-direction', 'row');
  expect(errors).toEqual([]);
}

test(
  'published Data List hydrates its semantic parts without replacing nodes',
  verifiesDataListHydration,
);
