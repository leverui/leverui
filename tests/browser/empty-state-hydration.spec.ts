import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderEmptyStateHydrationTree,
  type EmptyStateHydrationComponents,
} from '../../.storybook/empty-state-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as EmptyStateHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser Empty State to its server-rendered host. */
async function hydrateEmptyStateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/empty-state-hydration-example.ts';
  const { hydrateEmptyStateExample } = await import(modulePath);
  const host = document.getElementById('empty-state-hydration-root');
  if (!host) throw new Error('Empty State hydration root was not found.');
  hydrateEmptyStateExample(host);
}

/** Verify native node, parts, and style reuse across hydration and size changes. */
async function verifiesEmptyStateHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Build the published server tree before client attachment. */
    () => renderEmptyStateHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="empty-state-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-empty-state');
  await expect(root).toHaveCSS('padding-top', '24px');
  await expect(root.getByRole('heading', { name: 'No items' })).toBeVisible();
  await root.evaluate(
    /** Mark the server root before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Capture uncaught browser errors. */
  function recordPageError(error: Error): void {
    errors.push(error.message);
  }

  /** Capture hydration warnings from the browser console. */
  function recordConsole(message: { type(): string; text(): string }): void {
    if (
      /error|warning/.test(message.type()) &&
      /^Hydration\b|Hydration (mismatch|key miss|tag mismatch|structure mismatch)/i.test(
        message.text(),
      )
    ) {
      errors.push(message.text());
    }
  }

  page.on('pageerror', recordPageError);
  page.on('console', recordConsole);
  await page.evaluate(hydrateEmptyStateInBrowser);
  await expect(page.locator('#empty-state-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await page.locator('#empty-state-hydration-toggle').click();
  await expect(root).toHaveCSS('padding-top', '64px');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(root.getByRole('heading', { name: 'No items' })).toBeVisible();
  await page.locator('#empty-state-hydration-toggle').click();
  await expect(root).toHaveCSS('padding-top', '24px');
  await page.locator('#empty-state-hydration-toggle').click();
  await expect(root).toHaveCSS('padding-top', '64px');
  expect(errors).toEqual([]);
}

test('published Empty State hydrates its parts and reactive size', verifiesEmptyStateHydration);
