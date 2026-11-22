import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { AspectRatioHydrationComponents } from '../../.storybook/aspect-ratio-hydration-tree';
import { renderAspectRatioHydrationTree } from '../../.storybook/aspect-ratio-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as AspectRatioHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser ratio behavior to published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/aspect-ratio-hydration-example.tsx';
  const { hydrateAspectRatioExample } = await import(modulePath);
  const root = document.getElementById('aspect-ratio-hydration-root');
  if (!root) throw new Error('Aspect Ratio hydration root was not found.');
  hydrateAspectRatioExample(root);
}

/** Verify native node reuse and reactive ratio styles after hydration. */
async function verifiesAspectRatioHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderAspectRatioHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="aspect-ratio-hydration-root">${markup}</div>`,
  );
  const ratio = page.locator('#hydrated-ratio');
  const child = page.locator('#hydrated-ratio-child');
  await expect(ratio).toHaveCSS('height', '240px');
  await expect(child).toHaveCSS('height', '240px');
  await ratio.evaluate(
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

  /** Capture client errors from attachment or the subsequent update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#aspect-ratio-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(ratio).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-ratio-toggle').click();
  await expect(ratio).toHaveCSS('height', '135px');
  await expect(child).toHaveCSS('height', '135px');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test(
  'published AspectRatio hydrates and changes ratio without replacing content',
  verifiesAspectRatioHydration,
);
