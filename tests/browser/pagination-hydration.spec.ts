import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderPaginationHydrationTree,
  type PaginationHydrationComponents,
} from '../../.storybook/pagination-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as PaginationHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser entry to the server-rendered Pagination. */
async function hydratePaginationInBrowser(): Promise<void> {
  const modulePath = '/.storybook/pagination-hydration-example.tsx';
  const { hydratePaginationExample } = await import(modulePath);
  const root = document.getElementById('pagination-hydration-root');
  if (!root) throw new Error('Pagination hydration root was not found.');
  hydratePaginationExample(root);
}

/** Keep native nodes and machine state across server-to-browser hydration. */
async function verifiesPaginationHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderPaginationHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="pagination-hydration-root">${markup}</div>`,
  );
  const root = page.locator('[data-pagination-root]');
  const first = page.locator('[data-pagination-item][data-index="1"]');
  const text = page.locator('#hydrated-pagination-text');
  await expect(root).toHaveAttribute('aria-label', 'pagination');
  await expect(text).toHaveText('1 of 3');
  await first.evaluate(
    /** Mark a server node to verify hydration reuses it. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect browser exceptions from hydration and navigation. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePaginationInBrowser);
  await expect(page.locator('#pagination-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(first).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-pagination-next').click();
  await expect(text).toHaveText('2 of 3');
  await expect(first).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Pagination hydrates page nodes and navigation', verifiesPaginationHydration);
