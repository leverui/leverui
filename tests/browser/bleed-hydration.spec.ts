import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { BleedHydrationComponents } from '../../.storybook/bleed-hydration-tree';
import { renderBleedHydrationTree } from '../../.storybook/bleed-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as BleedHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser margin behavior to published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/bleed-hydration-example.tsx';
  const { hydrateBleedExample } = await import(modulePath);
  const root = document.getElementById('bleed-hydration-root');
  if (!root) throw new Error('Bleed hydration root was not found.');
  hydrateBleedExample(root);
}

/** Verify server node reuse and reactive logical margins after hydration. */
async function verifiesBleedHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderBleedHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="bleed-hydration-root">${markup}</div>`,
  );
  const bleed = page.locator('#hydrated-bleed');
  const child = page.locator('#hydrated-bleed-child');
  await expect(bleed).toHaveCSS('margin-inline-start', '-8px');
  await expect(bleed).toHaveCSS('margin-block-start', '-8px');
  await bleed.evaluate(
    /** Mark the server root to detect replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the server child to detect replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  const errors: string[] = [];

  /** Capture client errors from attachment and reactive updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#bleed-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(bleed).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-bleed-toggle').click();
  await expect(bleed).toHaveCSS('margin-block-start', '-24px');
  await expect(bleed).toHaveCSS('margin-inline-start', '-8px');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test(
  'published Bleed hydrates and changes logical margins without replacing nodes',
  verifiesBleedHydration,
);
