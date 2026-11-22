import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { WrapHydrationComponents } from '../../.storybook/wrap-hydration-tree';
import { renderWrapHydrationTree } from '../../.storybook/wrap-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as WrapHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser Wrap behavior to its published server elements. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/wrap-hydration-example.tsx';
  const { hydrateWrapExample } = await import(modulePath);
  const root = document.getElementById('wrap-hydration-root');
  if (!root) throw new Error('Wrap hydration root was not found.');
  hydrateWrapExample(root);
}

/** Verify hydration keeps both components and their child mounted. */
async function verifiesWrapHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderWrapHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="wrap-hydration-root">${markup}</div>`,
  );
  const wrap = page.locator('#hydrated-wrap');
  const item = page.locator('#hydrated-wrap-item');
  const child = page.locator('#hydrated-wrap-child');
  await expect(wrap).toHaveCSS('gap', '8px');
  await expect(item).toHaveCSS('align-items', 'flex-start');
  for (const locator of [wrap, item, child]) {
    await locator.evaluate(
      /** Mark each server element before Solid attaches. */
      (element) => element.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Capture browser errors during attachment and the live update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#wrap-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const locator of [wrap, item, child]) {
    await expect(locator).toHaveAttribute('data-server-node', 'true');
  }
  await page.locator('#hydrated-wrap-toggle').click();
  await expect(wrap).toHaveCSS('gap', '16px');
  await expect(item).toHaveCSS('align-items', 'center');
  for (const locator of [wrap, item, child]) {
    await expect(locator).toHaveAttribute('data-server-node', 'true');
  }
  expect(errors).toEqual([]);
}

test('published Wrap and WrapItem hydrate without replacing nodes', verifiesWrapHydration);
