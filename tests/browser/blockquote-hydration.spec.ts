import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderBlockquoteHydrationTree,
  type BlockquoteHydrationComponents,
} from '../../.storybook/blockquote-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as BlockquoteHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser behavior to the existing server quote tree. */
async function hydrateBlockquoteInBrowser(): Promise<void> {
  const modulePath = '/.storybook/blockquote-hydration-example.tsx';
  const { hydrateBlockquoteExample } = await import(modulePath);
  const root = document.getElementById('blockquote-hydration-root');
  if (!root) throw new Error('Blockquote hydration root was not found.');
  hydrateBlockquoteExample(root);
}

/** Verify node identity, styles, and reactivity after hydration. */
async function verifiesBlockquoteHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render published server components before attaching browser behavior. */
    () => renderBlockquoteHydrationTree(server),
  );
  expect(markup).toContain('data-variant="solid"');
  expect(markup).toContain('data-justify="start"');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="blockquote-hydration-root">${markup}</div>`,
  );
  const quote = page.locator('#hydrated-blockquote');
  await expect(quote).toHaveCSS('align-items', 'flex-start');
  await quote.evaluate(
    /** Mark the server node before Solid attaches to it. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect page failures during hydration and the state update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateBlockquoteInBrowser);
  await expect(page.locator('#blockquote-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(quote).toHaveAttribute('data-server-node', 'true');
  await page.locator('#blockquote-hydration-toggle').click();
  await expect(quote).toHaveAttribute('data-justify', 'center');
  await expect(quote).toHaveCSS('align-items', 'center');
  expect(errors).toEqual([]);
}

test('published Blockquote hydrates without replacing its figure', verifiesBlockquoteHydration);
