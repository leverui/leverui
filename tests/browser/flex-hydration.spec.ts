import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { FlexHydrationComponents } from '../../.storybook/flex-hydration-tree';
import { renderFlexHydrationTree } from '../../.storybook/flex-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as FlexHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser Flex behavior to published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/flex-hydration-example.tsx';
  const { hydrateFlexExample } = await import(modulePath);
  const root = document.getElementById('flex-hydration-root');
  if (!root) throw new Error('Flex hydration root was not found.');
  hydrateFlexExample(root);
}

/** Verify native nodes survive hydration and a live direction change. */
async function verifiesFlexHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared Flex tree through the published server entry. */
    () => renderFlexHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="flex-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-flex');
  const child = page.locator('#hydrated-flex-child');
  await expect(root).toHaveCSS('display', 'flex');
  await expect(root).toHaveCSS('flex-direction', 'row');
  await root.evaluate(
    /** Mark the server root before attaching Solid behavior. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the server child before attaching Solid behavior. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  const errors: string[] = [];

  /** Collect runtime errors during attachment and the live update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#flex-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-flex-toggle').click();
  await expect(root).toHaveCSS('flex-direction', 'column');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test(
  'published Flex hydrates and changes direction without replacing nodes',
  verifiesFlexHydration,
);
