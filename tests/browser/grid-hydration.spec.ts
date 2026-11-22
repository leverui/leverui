import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { GridHydrationComponents } from '../../.storybook/grid-hydration-tree';
import { renderGridHydrationTree } from '../../.storybook/grid-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as GridHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Grid tree to the published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/grid-hydration-example.tsx';
  const { hydrateGridExample } = await import(modulePath);
  const root = document.getElementById('grid-hydration-root');
  if (!root) throw new Error('Grid hydration root was not found.');
  hydrateGridExample(root);
}

/** Verify the grid and its child survive hydration and responsive changes. */
async function verifiesGridHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Use the shared tree through the published server exports. */
    () => renderGridHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="grid-hydration-root">${markup}</div>`,
  );
  const grid = page.locator('#hydrated-grid');
  const item = page.locator('#hydrated-grid-item');
  const child = page.locator('#hydrated-grid-child');
  await expect(grid).toHaveCSS('display', 'grid');
  await expect(grid).toHaveCSS('grid-template-columns', '40px');
  await expect(item).toHaveCSS('grid-column', 'span 1 / span 1');
  for (const locator of [grid, item, child]) {
    await locator.evaluate(
      /** Mark the server node before hydration. */
      (element) => {
        (element as HTMLElement).dataset.serverNode = 'true';
      },
    );
  }
  const errors: string[] = [];

  /** Collect errors raised while attaching and updating the tree. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#grid-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const locator of [grid, item, child]) {
    await expect(locator).toHaveAttribute('data-server-node', 'true');
  }
  await page.locator('#hydrated-grid-toggle').click();
  await expect(grid).toHaveCSS('grid-template-columns', '40px 40px');
  await expect(item).toHaveCSS('grid-column', 'span 2 / span 2');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Grid and GridItem hydrate without replacing nodes', verifiesGridHydration);
