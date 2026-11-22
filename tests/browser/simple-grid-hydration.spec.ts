import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { SimpleGridHydrationComponents } from '../../.storybook/simple-grid-hydration-tree';
import { renderSimpleGridHydrationTree } from '../../.storybook/simple-grid-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as SimpleGridHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser SimpleGrid tree to published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/simple-grid-hydration-example.tsx';
  const { hydrateSimpleGridExample } = await import(modulePath);
  const root = document.getElementById('simple-grid-hydration-root');
  if (!root) throw new Error('SimpleGrid hydration root was not found.');
  hydrateSimpleGridExample(root);
}

/** Verify hydration preserves nodes and changes the grid's track policy. */
async function verifiesSimpleGridHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same tree through published server exports. */
    () => renderSimpleGridHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="simple-grid-hydration-root">${markup}</div>`,
  );
  const grid = page.locator('#hydrated-simple-grid');
  const child = page.locator('#hydrated-simple-grid-child');
  await expect(grid).toHaveCSS('grid-template-columns', '150px 150px');
  for (const locator of [grid, child]) {
    await locator.evaluate(
      /** Mark server nodes before the Solid browser runtime attaches. */
      (element) => element.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Collect browser errors while the component hydrates and updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#simple-grid-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(grid).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-simple-grid-toggle').click();
  await expect(grid).toHaveCSS('grid-template-columns', '100px 100px 100px');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test(
  'published SimpleGrid hydrates and updates without node replacement',
  verifiesSimpleGridHydration,
);
