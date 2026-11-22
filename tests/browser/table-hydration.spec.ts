import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderTableHydrationTree,
  type TableHydrationComponents,
} from '../../.storybook/table-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as TableHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate published Table parts through their browser module. */
async function hydrateTableInBrowser(): Promise<void> {
  const modulePath = '/.storybook/table-hydration-example.ts';
  const { hydrateTableExample } = await import(modulePath);
  const root = document.getElementById('table-hydration-root');
  if (!root) throw new Error('Table hydration root was not found.');
  hydrateTableExample(root);
}

/** Verify semantic server nodes and reactive size survive hydration. */
async function verifiesTableHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared table through the published server entry. */
    () => renderTableHydrationTree(server),
  );
  expect(markup).toContain('<table');
  expect(markup).toContain('<tbody');
  expect(markup).toContain('leverui-table__cell');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="table-hydration-root">${markup}</div>`,
  );
  const cell = page.locator('#hydrated-table-cell');
  await expect(cell).toHaveCSS('padding-left', '8px');
  await cell.evaluate(
    /** Mark the server cell before client attachment. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record browser failures during hydration and updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateTableInBrowser);
  await expect(page.locator('#table-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(cell).toHaveAttribute('data-server-node', 'true');
  await page.locator('#table-hydration-toggle').click();
  await expect(cell).toHaveCSS('padding-left', '16px');
  expect(errors).toEqual([]);
}

test('published Table hydrates semantic parts and reactive variants', verifiesTableHydration);
