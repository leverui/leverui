import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderHighlightHydrationTree,
  type HighlightHydrationComponents,
} from '../../.storybook/highlight-hydration-tree';

const serverEntry = '../../dist/server/index.js';
/** The emitted server entry must expose the source-typed components below. */
const server = (await import(serverEntry)) as HighlightHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach published Highlight to the existing server-rendered mark. */
async function hydrateHighlightInBrowser(): Promise<void> {
  const modulePath = '/.storybook/highlight-hydration-example.ts';
  const { hydrateHighlightExample } = await import(modulePath);
  const root = document.getElementById('highlight-hydration-root');
  if (!root) throw new Error('Highlight hydration root was not found.');
  hydrateHighlightExample(root);
}

/** Verify server marks, CSS overrides, hydration identity, and live matching. */
async function verifiesHighlightHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Use the published server components for the initial tree. */
    () => renderHighlightHydrationTree(server),
  );
  expect(markup).toContain('lui-mark');
  expect(markup.match(/<mark\b/g)).toHaveLength(1);
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>.lui-mark{outline:2px solid rgb(1, 2, 3)}</style><div id="highlight-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#highlight-hydration-root');
  const mark = root.locator('mark');
  await expect(mark).toHaveText('Solid');
  await expect(mark).toHaveCSS('font-weight', '700');
  await expect(mark).toHaveCSS('outline-color', 'rgb(1, 2, 3)');
  await mark.evaluate(
    /** Tag the server mark before browser code attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect exceptions during hydration and subsequent matching. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateHighlightInBrowser);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(mark).toHaveAttribute('data-server-node', 'true');
  await page.locator('#highlight-hydration-toggle').click();
  await expect(mark).toHaveText('fast');
  await expect(mark).toHaveCSS('font-weight', '700');
  await expect(mark).toHaveCSS('outline-color', 'rgb(1, 2, 3)');
  await expect(root).toContainText('Solid is great and Solid is fast');
  expect(errors).toEqual([]);
}

test(
  'published Highlight hydrates and changes matches with CSS intact',
  verifiesHighlightHydration,
);
