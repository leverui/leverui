import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderTreeViewHydrationTree,
  type TreeViewHydrationComponents,
} from '../../.storybook/tree-view-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as TreeViewHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Read every style element's CSS, so hydration cannot add or change one unseen. */
async function styleElements(page: Page): Promise<string[]> {
  return page.locator('style').evaluateAll(
    /** Retain the emitted CSS of each style element. */
    (elements) =>
      elements.map(
        /** Record one style element after server rendering or hydration. */
        (element) => element.textContent ?? '',
      ),
  );
}

/** Mark an SSR item before hydration to detect native replacement. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Load the published client entry inside Storybook's browser origin. */
async function hydrateTreeViewInBrowser(): Promise<void> {
  const modulePath = '/.storybook/tree-view-hydration-example.tsx';
  const { hydrateTreeViewExample } = await import(modulePath);
  const target = document.getElementById('tree-view-hydration-root');
  if (!target) throw new Error('The Tree View hydration host was not found.');
  hydrateTreeViewExample(target);
}

/** Verify native nodes, styles, and selection survive published hydration. */
async function verifiesTreeViewHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the initial collection through the published server entry. */
    () => renderTreeViewHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="tree-view-hydration-root">${markup}</div>`,
  );
  const leaf = page.getByTestId('hydrated-tree-leaf');
  await expect(leaf).toHaveAttribute('role', 'row');
  await leaf.evaluate(markServerNode);
  const serverStyles = await styleElements(page);
  const errors: string[] = [];

  /** Capture hydration errors rather than relying on visible state alone. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateTreeViewInBrowser);
  await expect(page.locator('#tree-view-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(leaf).toHaveAttribute('data-server-node', 'true');
  expect(await styleElements(page)).toEqual(serverStyles);
  await leaf.click();
  await expect(leaf).toHaveAttribute('aria-selected', 'true');
  await expect(leaf).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Tree View hydrates existing nodes and machine state', verifiesTreeViewHydration);
