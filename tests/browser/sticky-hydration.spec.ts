import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { StickyHydrationComponents } from '../../.storybook/sticky-hydration-tree';
import { renderStickyHydrationTree } from '../../.storybook/sticky-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as StickyHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser Sticky behavior to its published server nodes. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/sticky-hydration-example.tsx';
  const { hydrateStickyExample } = await import(modulePath);
  const root = document.getElementById('sticky-hydration-root');
  if (!root) throw new Error('Sticky hydration root was not found.');
  hydrateStickyExample(root);
}

/** Verify hydration preserves native nodes while changing a token offset. */
async function verifiesStickyHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderStickyHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="sticky-hydration-root">${markup}</div>`,
  );
  const sticky = page.locator('#hydrated-sticky');
  const child = page.locator('#hydrated-sticky-child');
  await expect(sticky).toHaveCSS('position', 'sticky');
  await expect(sticky).toHaveCSS('top', '0px');
  for (const locator of [sticky, child]) {
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
  await expect(page.locator('#sticky-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(sticky).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-sticky-toggle').click();
  await expect(sticky).toHaveCSS('top', '16px');
  await expect(sticky).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Sticky hydrates and updates without node replacement', verifiesStickyHydration);
